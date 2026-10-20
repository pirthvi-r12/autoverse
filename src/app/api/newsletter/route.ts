import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db/config";
import { dbCreateLead } from "@/lib/db/leads-repo";
import { MOCK_LEADS } from "@/lib/mock-data";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  if (isDatabaseConfigured()) {
    await dbCreateLead({ type: "newsletter", email, metadata: {} });
  } else {
    MOCK_LEADS.unshift({
      id: crypto.randomUUID(),
      type: "newsletter",
      email,
      metadata: {},
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
