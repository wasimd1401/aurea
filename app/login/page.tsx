import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuthCookie } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password")?.toString() ?? "";
  if (!process.env.APP_PASSWORD) {
    throw new Error("APP_PASSWORD is not configured");
  }

  if (password === process.env.APP_PASSWORD) {
    const cookie = getAuthCookie();
    cookies().set(cookie.name, cookie.value, cookie.options);
    redirect("/");
  }

  redirect("/login?error=invalid");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error === "invalid";

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the shared password to access POD-to-Pay Autopilot.
      </p>
      <form action={loginAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          App password
          <input
            name="password"
            type="password"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-rose-600">Invalid password. Try again.</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
