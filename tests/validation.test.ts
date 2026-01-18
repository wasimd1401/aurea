import { describe, expect, it } from "vitest";
import { brokerSchema, loadSchema } from "@/lib/validation";

describe("validation schemas", () => {
  it("validates broker input", () => {
    const result = brokerSchema.safeParse({
      name: "Test Broker",
      billingEmail: "billing@test.com",
      submissionMethod: "EMAIL",
      subjectTemplate: "Invoice {{loadNumber}}",
      requiredDocs: "POD, LUMPER",
      namingRules: "Include load number",
      notes: "Test notes",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing broker fields", () => {
    const result = brokerSchema.safeParse({
      name: "",
      billingEmail: "bad",
      submissionMethod: "EMAIL",
      subjectTemplate: "",
      requiredDocs: "",
      namingRules: "",
    });
    expect(result.success).toBe(false);
  });

  it("validates load input", () => {
    const result = loadSchema.safeParse({
      brokerId: "b1",
      loadNumber: "L-100",
      brokerRef: "BR-100",
      pickupDate: "2024-01-01",
      deliveryDate: "2024-01-02",
      amount: "1500.00",
    });
    expect(result.success).toBe(true);
  });
});
