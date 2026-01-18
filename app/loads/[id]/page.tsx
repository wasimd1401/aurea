import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { EmailSendForm } from "@/components/EmailSendForm";
import {
  analyzeRejectionAction,
  applyForwardedEmail,
  generateInvoicePacket,
  recordPayment,
  updateLoadStatus,
  uploadDocument,
} from "@/app/actions/load-actions";

export default async function LoadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const load = await prisma.load.findUnique({
    where: { id: params.id },
    include: {
      broker: true,
      documents: true,
      submissions: { orderBy: { createdAt: "desc" } },
      rejections: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!load) {
    return <p className="text-sm text-slate-500">Load not found.</p>;
  }

  const latestSubmission = load.submissions[0];
  const attachmentChecklist = (load.broker.requiredDocs as string[]).map(
    (doc) => ({
      label: doc,
      present: load.documents.some(
        (file) =>
          file.type === doc ||
          file.fileName.toLowerCase().includes(doc.toLowerCase()),
      ),
    }),
  );

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Load {load.loadNumber}
            </h1>
            <p className="text-sm text-slate-500">
              Broker: {load.broker.name} • Ref: {load.brokerRef}
            </p>
            <p className="text-sm text-slate-500">
              Amount: {load.amount ? `$${load.amount.toFixed(2)}` : "Pending"}
            </p>
          </div>
          <StatusBadge status={load.status} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span>Pickup: {load.pickupDate?.toDateString() ?? "—"}</span>
          <span>Delivery: {load.deliveryDate?.toDateString() ?? "—"}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["DRAFT", "SUBMITTED", "ACCEPTED", "REJECTED", "PAID"].map(
            (status) => (
              <form
                key={status}
                action={async () => {
                  "use server";
                  await updateLoadStatus(load.id, status);
                }}
              >
                <button
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  type="submit"
                >
                  Mark {status.toLowerCase()}
                </button>
              </form>
            ),
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Document uploads
            </h2>
            <p className="text-sm text-slate-500">
              Upload PODs, lumper receipts, scale tickets, and other docs.
            </p>
            <form
              action={async (formData) => {
                "use server";
                await uploadDocument(load.id, formData);
              }}
              className="mt-4 flex flex-wrap items-end gap-4"
            >
              <label className="text-sm font-medium text-slate-700">
                Document type
                <select
                  name="type"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="POD">POD</option>
                  <option value="LUMPER">Lumper</option>
                  <option value="SCALE">Scale</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                File
                <input
                  name="file"
                  type="file"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Upload
              </button>
            </form>
            <div className="mt-4 space-y-2">
              {load.documents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No documents uploaded yet.
                </p>
              ) : (
                load.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {doc.type}
                      </p>
                      <p className="text-xs text-slate-500">{doc.fileName}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {doc.createdAt.toDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice packet
            </h2>
            <p className="text-sm text-slate-500">
              Generate an invoice PDF, checklist, and email draft.
            </p>
            <form
              action={async () => {
                "use server";
                await generateInvoicePacket(load.id);
              }}
              className="mt-4"
            >
              <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Generate packet
              </button>
            </form>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Attachment checklist
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {attachmentChecklist.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.present ? "bg-emerald-500" : "bg-rose-400"
                        }`}
                      />
                      {item.label} {item.present ? "(uploaded)" : "(missing)"}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Email draft
                </h3>
                {latestSubmission ? (
                  <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Subject</p>
                      <CopyButton text={latestSubmission.subject} />
                    </div>
                    <p className="mt-2">{latestSubmission.subject}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-semibold">Body</p>
                      <CopyButton text={latestSubmission.body} />
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {latestSubmission.body}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Generate the packet to create the email draft.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <EmailSendForm loadId={load.id} />
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                  If SMTP is not configured, use copy buttons above.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Rejection analysis
            </h2>
            <p className="text-sm text-slate-500">
              Paste a rejection email to generate corrective actions.
            </p>
            <form
              action={async (formData) => {
                "use server";
                await analyzeRejectionAction(load.id, formData);
              }}
              className="mt-4 space-y-3"
            >
              <textarea
                name="rawText"
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Paste rejection email here..."
                required
              />
              <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Analyze rejection
              </button>
            </form>
            <div className="mt-4 space-y-3">
              {load.rejections.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No rejection analysis yet.
                </p>
              ) : (
                load.rejections.map((rejection) => (
                  <div
                    key={rejection.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-semibold text-slate-900">
                      Reason: {rejection.reason}
                    </p>
                    <p className="text-xs text-slate-500">
                      Recommended fix: {rejection.recommendedFix}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Forwarded email intake
            </h2>
            <p className="text-sm text-slate-500">
              Paste forwarded broker emails to auto-fill key fields.
            </p>
            <form
              action={async (formData) => {
                "use server";
                await applyForwardedEmail(load.id, formData);
              }}
              className="mt-4 space-y-3"
            >
              <textarea
                name="forwardedText"
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Forwarded email text..."
                required
              />
              <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Extract and update
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Payment tracking
            </h2>
            <p className="text-sm text-slate-500">
              Record paid dates to update DSO metrics.
            </p>
            <form
              action={async (formData) => {
                "use server";
                await recordPayment(load.id, formData);
              }}
              className="mt-4 grid gap-3"
            >
              <label className="text-sm font-medium text-slate-700">
                Paid date
                <input
                  name="paidDate"
                  type="date"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Paid amount
                <input
                  name="paidAmount"
                  type="number"
                  step="0.01"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Notes
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Mark paid
              </button>
            </form>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              {load.payments.length === 0 ? (
                <p>No payments recorded.</p>
              ) : (
                load.payments.map((payment) => (
                  <div key={payment.id} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    Paid {payment.paidDate.toDateString()} •{" "}
                    {payment.paidAmount ? `$${payment.paidAmount.toFixed(2)}` : "—"}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
