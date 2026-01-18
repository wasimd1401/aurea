"use server";

import { brokerSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBroker(formData: FormData) {
  const parsed = brokerSchema.safeParse({
    name: formData.get("name"),
    billingEmail: formData.get("billingEmail"),
    submissionMethod: formData.get("submissionMethod"),
    subjectTemplate: formData.get("subjectTemplate"),
    requiredDocs: formData.get("requiredDocs"),
    namingRules: formData.get("namingRules"),
    notes: formData.get("notes")?.toString() || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  await prisma.broker.create({
    data: {
      name: parsed.data.name,
      billingEmail: parsed.data.billingEmail,
      submissionMethod: parsed.data.submissionMethod,
      subjectTemplate: parsed.data.subjectTemplate,
      requiredDocs: parsed.data.requiredDocs,
      namingRules: parsed.data.namingRules,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/brokers");
}
