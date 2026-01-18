import { cookies } from "next/headers";

const COOKIE_NAME = "pod_autopilot_session";

export function isAuthenticated() {
  return cookies().get(COOKIE_NAME)?.value === "authenticated";
}

export function getAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: "authenticated",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  };
}
