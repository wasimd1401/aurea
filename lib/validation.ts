import { z } from "zod";

export const brokerSchema = z.object({
  name: z.string().min(2, "Broker name is required"),
  billingEmail: z.string().email("Valid billing email required"),
  submissionMethod: z.enum(["EMAIL", "PORTAL"]),
  subjectTemplate: z.string().min(3, "Subject template is required"),
  requiredDocs: z
    .string()
    .min(1, "Required docs are required")
    .transform((value) => value.split(",").map((item) => item.trim())),
  namingRules: z.string().min(3, "Naming rules required"),
  notes: z.string().optional(),
});

export const loadSchema = z.object({
  brokerId: z.string().min(1, "Broker required"),
  loadNumber: z.string().min(1, "Load number required"),
  brokerRef: z.string().min(1, "Broker reference required"),
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  amount: z.string().optional(),
});

export const rejectionSchema = z.object({
  rawText: z.string().min(10, "Rejection text required"),
});

export const paymentSchema = z.object({
  paidDate: z.string().min(1, "Paid date required"),
  paidAmount: z.string().optional(),
  notes: z.string().optional(),
});

export const documentSchema = z.object({
  type: z.enum(["POD", "LUMPER", "SCALE", "OTHER"]),
});
