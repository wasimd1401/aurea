"use client";

import { useFormState } from "react-dom";
import { sendSubmissionEmail } from "@/app/actions/load-actions";

type State = { status: string; message: string };

const initialState: State = { status: "idle", message: "" };

export function EmailSendForm({ loadId }: { loadId: string }) {
  const [state, formAction] = useFormState(async () => {
    const result = await sendSubmissionEmail(loadId);
    return {
      status: result.status,
      message: result.message,
    };
  }, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
      >
        Send via SMTP
      </button>
      {state.message ? (
        <p className="text-xs text-slate-500">{state.message}</p>
      ) : null}
    </form>
  );
}
