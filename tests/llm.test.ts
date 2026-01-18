import { describe, expect, it } from "vitest";
import { extractFieldsFromDocument, analyzeRejection, draftInvoiceEmail } from "@/lib/llm";

describe("llm adapter mocks", () => {
  it("extracts deterministic fields from text", async () => {
    const result = await extractFieldsFromDocument({ text: "Load 1234 amount 1500.00" });
    expect(result.loadNumber).toBe("1234");
    expect(result.amount).toBe("1500.00");
  });

  it("drafts a basic email", async () => {
    const load = {
      id: "1",
      brokerId: "b1",
      loadNumber: "L-100",
      brokerRef: "BR-55",
      pickupDate: null,
      deliveryDate: null,
      amount: 1200,
      status: "DRAFT",
      createdAt: new Date(),
    } as const;
    const broker = {
      id: "b1",
      name: "Test Broker",
      billingEmail: "test@example.com",
      submissionMethod: "EMAIL",
      subjectTemplate: "Invoice {{loadNumber}}",
      requiredDocs: ["POD"],
      namingRules: "",
      notes: null,
      createdAt: new Date(),
    } as const;
    const email = await draftInvoiceEmail(load, broker, []);
    expect(email.subject).toContain("L-100");
  });

  it("analyzes rejections with recommended fixes", async () => {
    const load = {
      id: "1",
      brokerId: "b1",
      loadNumber: "L-100",
      brokerRef: "BR-55",
      pickupDate: null,
      deliveryDate: null,
      amount: 1200,
      status: "DRAFT",
      createdAt: new Date(),
    } as const;
    const broker = {
      id: "b1",
      name: "Test Broker",
      billingEmail: "test@example.com",
      submissionMethod: "EMAIL",
      subjectTemplate: "Invoice {{loadNumber}}",
      requiredDocs: ["POD"],
      namingRules: "",
      notes: null,
      createdAt: new Date(),
    } as const;
    const result = await analyzeRejection("Missing POD", load, broker);
    expect(result.reason).toContain("rejection");
  });
});
