import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db/config";
import { dbCreateLead } from "@/lib/db/leads-repo";
import { MOCK_LEADS } from "@/lib/mock-data";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/constants";

export async function POST(req: Request) {
  const body = await req.json();
  if (body.website) return NextResponse.json({ ok: true });

  const { full_name, email, phone, message } = body;
  if (!full_name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (isDatabaseConfigured()) {
    await dbCreateLead({
      type: "contact",
      full_name,
      email,
      phone,
      message,
      metadata: {},
    });
  } else {
    MOCK_LEADS.unshift({
      id: crypto.randomUUID(),
      type: "contact",
      full_name,
      email,
      phone,
      message,
      metadata: {},
      created_at: new Date().toISOString(),
    });
  }

  await sendEmail({
    to: SITE.email,
    subject: `New enquiry from ${full_name}`,
    html: `<p>${message}</p><p>${phone} · ${email}</p>`,
  });

  return NextResponse.json({ ok: true });
}
