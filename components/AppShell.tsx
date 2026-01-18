import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const isLoggedIn =
    cookies().get("pod_autopilot_session")?.value === "authenticated";

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-lg font-semibold text-slate-900">
              POD-to-Pay Autopilot
            </Link>
            <p className="text-sm text-slate-500">
              Automate POD-to-invoice workflows for small carriers.
            </p>
          </div>
          {isLoggedIn ? (
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/loads" className="hover:text-slate-900">
                Loads
              </Link>
              <Link href="/brokers" className="hover:text-slate-900">
                Broker Playbooks
              </Link>
              <form action="/api/logout" method="post">
                <button className="rounded-md border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50">
                  Sign out
                </button>
              </form>
            </nav>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
