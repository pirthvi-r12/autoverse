import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createDemoAdminCookieValue,
} from "@/lib/admin/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  const demoEmail = process.env.ADMIN_DEMO_EMAIL ?? "admin@autoverse.com";
  const demoPassword = process.env.ADMIN_DEMO_PASSWORD ?? "";

  if (!demoPassword) {
    return NextResponse.json(
      {
        error:
          "Set ADMIN_DEMO_PASSWORD and ADMIN_SESSION_SECRET in .env.local for admin login.",
      },
      { status: 503 }
    );
  }

  if (email !== demoEmail || password !== demoPassword) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const token = await createDemoAdminCookieValue();
  if (!token) {
    return NextResponse.json(
      { error: "Set ADMIN_SESSION_SECRET in .env.local" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
