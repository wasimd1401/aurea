import { format } from "date-fns";
import type { Broker, Document, Load } from "@prisma/client";

type ExtractInput = { text?: string; imagePath?: string };

export async function extractFieldsFromDocument(input: ExtractInput) {
  const seed = (input.text ?? input.imagePath ?? "").toLowerCase();
  const loadNumberMatch = seed.match(/load\s?(\d+)/i);
  const amountMatch = seed.match(/\$?(\d{2,5}\.\d{2})/);

  return {
    loadNumber: loadNumberMatch?.[1] ?? "AUTO-1001",
    brokerRef: "BRK-" + (loadNumberMatch?.[1] ?? "1001"),
    deliveryDate: format(new Date(), "yyyy-MM-dd"),
    amount: amountMatch?.[1] ?? "1250.00",
    carrierNotes: "Mock extraction completed. Replace with LLM adapter.",
  };
}

export async function draftInvoiceEmail(
  load: Load,
  broker: Broker,
  docs: Document[],
) {
  const attachments = docs.map((doc) => doc.type).join(", ") || "Invoice PDF";
  const subject = broker.subjectTemplate
    .replace("{{loadNumber}}", load.loadNumber)
    .replace("{{brokerRef}}", load.brokerRef)
    .replace("{{carrierName}}", "POD-to-Pay Autopilot");

  const body = `Hello ${broker.name} AP Team,

Attached is our invoice packet for load ${load.loadNumber} (${load.brokerRef}).

Attachments: ${attachments}
Amount: ${load.amount ? `$${load.amount.toFixed(2)}` : "Pending"}

Please confirm receipt and let us know if anything is missing.

Thanks,
POD-to-Pay Autopilot`;

  return { subject, body };
}

export async function analyzeRejection(
  rawText: string,
  load: Load,
  broker: Broker,
) {
  const lowered = rawText.toLowerCase();
  const missingDoc =
    lowered.includes("missing") || lowered.includes("need") ? "POD" : "N/A";

  return {
    reason: `Likely rejection due to ${missingDoc} or formatting issue.`,
    recommendedFix:
      missingDoc === "POD"
        ? "Upload the missing POD and resend the invoice packet."
        : "Confirm subject line and attachment checklist match broker playbook.",
    revisedEmailDraft: `Hello ${broker.name} AP Team,

Thanks for the update regarding load ${load.loadNumber}. We've corrected the packet and reattached the required documents.

Please review the updated invoice packet and confirm if anything else is needed.

Best,
POD-to-Pay Autopilot`,
  };
}
