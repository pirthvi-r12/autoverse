import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "autoverse_admin_session";

export type AdminAuthResult =
  | { ok: true; mode: "demo" }
  | { ok: false; reason: "unauthenticated" };

function demoSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  const password = process.env.ADMIN_DEMO_PASSWORD ?? "";
  if (!secret || !password) return null;
  const data = new TextEncoder().encode(`${secret}:${password}`);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export async function verifyDemoAdminCookie(
  cookieValue: string | undefined
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await demoSessionToken();
  if (!expected) return false;
  return cookieValue === expected;
}

export async function createDemoAdminCookieValue(): Promise<string | null> {
  return demoSessionToken();
}

export async function verifyAdminAccess(
  request: NextRequest
): Promise<AdminAuthResult> {
  const demoOk = await verifyDemoAdminCookie(
    request.cookies.get(ADMIN_COOKIE)?.value
  );
  if (demoOk) {
    return { ok: true, mode: "demo" };
  }
  return { ok: false, reason: "unauthenticated" };
}
