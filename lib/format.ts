import type { LoadStatus } from "@prisma/client";

export const statusLabels: Record<LoadStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PAID: "Paid",
};
