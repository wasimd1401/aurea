import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { createLoad } from "@/app/actions/load-actions";

export default async function LoadsPage() {
  const [loads, brokers] = await Promise.all([
    prisma.load.findMany({
      include: { broker: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.broker.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Loads</h1>
        <p className="text-sm text-slate-500">
          Create loads manually or from forwarded email details.
        </p>
        <div className="mt-4 space-y-3">
          {loads.length === 0 ? (
            <p className="text-sm text-slate-500">
              No loads yet. Create one below.
            </p>
          ) : (
            loads.map((load) => (
              <div
                key={load.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {load.loadNumber} • {load.broker.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ref: {load.brokerRef} • Amount:{" "}
                    {load.amount ? `$${load.amount.toFixed(2)}` : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={load.status} />
                  <Link
                    href={`/loads/${load.id}`}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create load</h2>
        <form action={createLoad} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Broker
            <select
              name="brokerId"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            >
              <option value="">Select broker</option>
              {brokers.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Load number
            <input
              name="loadNumber"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Broker reference
            <input
              name="brokerRef"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Pickup date
            <input
              name="pickupDate"
              type="date"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Delivery date
            <input
              name="deliveryDate"
              type="date"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Amount ($)
            <input
              name="amount"
              type="number"
              step="0.01"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save load
          </button>
        </form>
      </section>
    </div>
  );
}
