import { PrismaClient, SubmissionMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.broker.createMany({
    data: [
      {
        name: "Northwind Logistics",
        billingEmail: "billing@northwindlogistics.com",
        submissionMethod: SubmissionMethod.EMAIL,
        subjectTemplate: "Invoice {{loadNumber}} - {{carrierName}}",
        requiredDocs: ["POD", "LUMPER"],
        namingRules: "Include load number and carrier name in the subject.",
        notes: "Send invoices within 24 hours of delivery.",
      },
      {
        name: "BlueLine Freight",
        billingEmail: "ap@bluelinefreight.com",
        submissionMethod: SubmissionMethod.EMAIL,
        subjectTemplate: "BLF {{brokerRef}} | {{loadNumber}} Invoice",
        requiredDocs: ["POD", "SCALE", "RATECONF"],
        namingRules: "Use broker reference in the subject line.",
        notes: "Include scale tickets for reefer loads.",
      },
      {
        name: "Sunset 3PL",
        billingEmail: "invoices@sunset3pl.com",
        submissionMethod: SubmissionMethod.PORTAL,
        subjectTemplate: "Invoice for Load {{loadNumber}}",
        requiredDocs: ["POD"],
        namingRules: "Portal requires PDF naming: LoadNumber_Carrier.pdf",
        notes: "Portal submission required. Email draft is for internal use.",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
