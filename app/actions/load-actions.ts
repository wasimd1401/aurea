"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { documentSchema, loadSchema, paymentSchema, rejectionSchema } from "@/lib/validation";
import { extractFieldsFromDocument, draftInvoiceEmail, analyzeRejection } from "@/lib/llm";
import { generateInvoicePdf } from "@/lib/invoice";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

export async function createLoad(formData: FormData) {
  const parsed = loadSchema.safeParse({
    brokerId: formData.get("brokerId"),
    loadNumber: formData.get("loadNumber"),
    brokerRef: formData.get("brokerRef"),
    pickupDate: formData.get("pickupDate"),
    deliveryDate: formData.get("deliveryDate"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  await prisma.load.create({
    data: {
      brokerId: parsed.data.brokerId,
      loadNumber: parsed.data.loadNumber,
      brokerRef: parsed.data.brokerRef,
      pickupDate: parsed.data.pickupDate ? new Date(parsed.data.pickupDate) : null,
      deliveryDate: parsed.data.deliveryDate
        ? new Date(parsed.data.deliveryDate)
        : null,
      amount: parsed.data.amount ? Number(parsed.data.amount) : null,
    },
  });

  revalidatePath("/loads");
}

export async function updateLoadStatus(loadId: string, status: string) {
  await prisma.load.update({
    where: { id: loadId },
    data: { status: status as "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "PAID" },
  });
  revalidatePath(`/loads/${loadId}`);
  revalidatePath("/loads");
  revalidatePath("/");
}

export async function uploadDocument(loadId: string, formData: FormData) {
  const parsed = documentSchema.safeParse({
    type: formData.get("type"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("File upload is required");
  }

  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".bin";
  const fileName = `${loadId}-${Date.now()}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const extracted = await extractFieldsFromDocument({ text: file.name });

  await prisma.document.create({
    data: {
      loadId,
      type: parsed.data.type,
      fileName: file.name,
      filePath: path.relative(process.cwd(), filePath),
      extractedText: JSON.stringify(extracted, null, 2),
    },
  });

  revalidatePath(`/loads/${loadId}`);
}

export async function generateInvoicePacket(loadId: string) {
  const load = await prisma.load.findUnique({
    where: { id: loadId },
    include: { broker: true, documents: true },
  });
  if (!load) {
    throw new Error("Load not found");
  }

  const pdfBytes = await generateInvoicePdf(load, load.broker);
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const fileName = `invoice-${load.loadNumber}-${Date.now()}.pdf`;
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, pdfBytes);

  await prisma.document.create({
    data: {
      loadId,
      type: "OTHER",
      fileName,
      filePath: path.relative(process.cwd(), filePath),
      extractedText: "Invoice PDF generated.",
    },
  });

  const emailDraft = await draftInvoiceEmail(load, load.broker, load.documents);
  await prisma.submission.create({
    data: {
      loadId,
      toEmail: load.broker.billingEmail,
      subject: emailDraft.subject,
      body: emailDraft.body,
      status: "SUBMITTED",
      meta: {
        generatedAt: new Date().toISOString(),
        requiredDocs: load.broker.requiredDocs,
      },
    },
  });

  revalidatePath(`/loads/${loadId}`);
}

export async function sendSubmissionEmail(loadId: string) {
  const submission = await prisma.submission.findFirst({
    where: { loadId },
    orderBy: { createdAt: "desc" },
  });
  const load = await prisma.load.findUnique({
    where: { id: loadId },
    include: { broker: true, documents: true },
  });

  if (!submission || !load) {
    throw new Error("Submission draft not found");
  }

  const hasSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtp) {
    return { status: "fallback", message: "SMTP not configured." };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const attachments = load.documents.map((doc) => ({
      filename: doc.fileName,
      path: path.join(process.cwd(), doc.filePath),
    }));

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: submission.toEmail,
      subject: submission.subject,
      text: submission.body,
      attachments,
    });

    await prisma.submission.update({
      where: { id: submission.id },
      data: { sentAt: new Date(), status: "SUBMITTED" },
    });

    await prisma.load.update({
      where: { id: loadId },
      data: { status: "SUBMITTED" },
    });

    revalidatePath(`/loads/${loadId}`);
    revalidatePath("/loads");
    revalidatePath("/");
    return { status: "sent", message: "Email sent successfully." };
  } catch (error) {
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "FAILED" },
    });
    return { status: "failed", message: "SMTP send failed. Use copy fallback." };
  }
}

export async function analyzeRejectionAction(loadId: string, formData: FormData) {
  const parsed = rejectionSchema.safeParse({
    rawText: formData.get("rawText"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  const load = await prisma.load.findUnique({
    where: { id: loadId },
    include: { broker: true },
  });

  if (!load) {
    throw new Error("Load not found");
  }

  const analysis = await analyzeRejection(
    parsed.data.rawText,
    load,
    load.broker,
  );

  await prisma.rejection.create({
    data: {
      loadId,
      rawText: parsed.data.rawText,
      reason: analysis.reason,
      recommendedFix: analysis.recommendedFix,
    },
  });

  await prisma.load.update({
    where: { id: loadId },
    data: { status: "REJECTED" },
  });

  revalidatePath(`/loads/${loadId}`);
  revalidatePath("/loads");
  revalidatePath("/");
}

export async function recordPayment(loadId: string, formData: FormData) {
  const parsed = paymentSchema.safeParse({
    paidDate: formData.get("paidDate"),
    paidAmount: formData.get("paidAmount"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  await prisma.payment.create({
    data: {
      loadId,
      paidDate: new Date(parsed.data.paidDate),
      paidAmount: parsed.data.paidAmount
        ? Number(parsed.data.paidAmount)
        : null,
      notes: parsed.data.notes,
    },
  });

  await prisma.load.update({
    where: { id: loadId },
    data: { status: "PAID" },
  });

  revalidatePath(`/loads/${loadId}`);
  revalidatePath("/loads");
  revalidatePath("/");
}

export async function applyForwardedEmail(loadId: string, formData: FormData) {
  const forwardedText = formData.get("forwardedText")?.toString() ?? "";
  if (forwardedText.trim().length < 10) {
    throw new Error("Forwarded email text is required");
  }

  const extracted = await extractFieldsFromDocument({ text: forwardedText });

  await prisma.load.update({
    where: { id: loadId },
    data: {
      loadNumber: extracted.loadNumber ?? undefined,
      brokerRef: extracted.brokerRef ?? undefined,
      deliveryDate: extracted.deliveryDate
        ? new Date(extracted.deliveryDate)
        : undefined,
      amount: extracted.amount ? Number(extracted.amount) : undefined,
    },
  });

  revalidatePath(`/loads/${loadId}`);
  revalidatePath("/loads");
  revalidatePath("/");
}
