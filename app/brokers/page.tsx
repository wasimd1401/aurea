import { prisma } from "@/lib/prisma";
import { createBroker } from "@/app/actions/broker-actions";

export default async function BrokersPage() {
  const brokers = await prisma.broker.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Broker playbooks</h1>
        <p className="text-sm text-slate-500">
          Store invoicing rules, subject templates, and required documents.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {broker.name}
              </h2>
              <p className="text-xs text-slate-500">
                Billing: {broker.billingEmail}
              </p>
              <p className="text-xs text-slate-500">
                Submission: {broker.submissionMethod}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Required docs: {(broker.requiredDocs as string[]).join(", ")}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Notes: {broker.notes ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Add a broker playbook
        </h2>
        <form action={createBroker} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Broker name
            <input
              name="name"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Billing email
            <input
              name="billingEmail"
              type="email"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Submission method
            <select
              name="submissionMethod"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="EMAIL">Email</option>
              <option value="PORTAL">Portal</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Subject template
            <input
              name="subjectTemplate"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Invoice {{loadNumber}} - {{carrierName}}"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Required docs (comma separated)
            <input
              name="requiredDocs"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="POD, LUMPER, SCALE"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Naming rules
            <input
              name="namingRules"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Notes
            <textarea
              name="notes"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={3}
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save broker
          </button>
        </form>
      </section>
    </div>
  );
}
