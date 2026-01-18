import { statusLabels } from "@/lib/format";
import type { LoadStatus } from "@prisma/client";
import clsx from "clsx";

const statusStyles: Record<LoadStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  PAID: "bg-amber-100 text-amber-700",
};

export function StatusBadge({ status }: { status: LoadStatus }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2 py-1 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
