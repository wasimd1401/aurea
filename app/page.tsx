import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { statusLabels } from "@/lib/format";
import { differenceInCalendarDays } from "date-fns";

export default async function DashboardPage() {
  const [loads, brokers] = await Promise.all([
    prisma.load.findMany({
      include: { broker: true, payments: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.broker.findMany({
      include: {
        loads: { include: { payments: { orderBy: { createdAt: "desc" } } } },
      },
    }),
  ]);

  const statusCounts = loads.reduce<Record<string, number>>((acc, load) => {
    acc[load.status] = (acc[load.status] ?? 0) + 1;
    return acc;
  }, {});

  const needsAttention = loads.filter(
    (load) =>
      load.status === "REJECTED" ||
      load.status === "DRAFT" ||
      !load.amount,
  );

  const brokerDso = brokers.map((broker) => {
    const paidLoads = broker.loads.filter((load) => load.payments.length > 0);
    const avgDays =
      paidLoads.length === 0
        ? null
        : Math.round(
            paidLoads.reduce((sum, load) => {
              const payment = load.payments[0];
              const baseDate = load.deliveryDate ?? load.createdAt;
              return (
                sum + differenceInCalendarDays(payment.paidDate, baseDate)
              );
            }, 0) / paidLoads.length,
          );

    return { broker, avgDays, paidCount: paidLoads.length };
  });

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div
            key={status}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {statusCounts[status] ?? 0}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Needs attention
            </h2>
            <p className="text-sm text-slate-500">
              Loads requiring action, missing details, or rejected.
            </p>
          </div>
          <Link
            href="/loads"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            View all loads →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {needsAttention.length === 0 ? (
            <p className="text-sm text-slate-500">
              All caught up! No urgent loads right now.
            </p>
          ) : (
            needsAttention.map((load) => (
              <div
                key={load.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {load.loadNumber} • {load.broker.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status: {statusLabels[load.status]}
                  </p>
                </div>
                <Link
                  href={`/loads/${load.id}`}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Open →
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Broker DSO estimates
          </h2>
          <p className="text-sm text-slate-500">
            Average days from delivery to paid (manual paid dates).
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {brokerDso.map(({ broker, avgDays, paidCount }) => (
            <div
              key={broker.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">
                {broker.name}
              </p>
              <p className="text-xs text-slate-500">
                {paidCount === 0
                  ? "No paid loads yet."
                  : `Avg DSO: ${avgDays} days`}
              </p>
              <p className="text-xs text-slate-500">
                Submission: {broker.submissionMethod}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
