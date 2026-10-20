import { NextResponse } from "next/server";
import { z } from "zod";
import { createInspection } from "@/lib/data/inspections";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/constants";

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  city: z.string().min(2),
  car_brand: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.number().optional(),
  registration_number: z.string().optional(),
  mileage: z.number().optional(),
  color: z.string().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  inspection_type: z.enum(["basic", "standard", "full_premium"]),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  location_type: z.enum(["showroom", "home_visit"]),
  address: z.string().optional(),
  notes: z.string().optional(),
  honeypot: z.string().optional(),
  linked_car_id: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const { honeypot: _, ...payload } = parsed.data;
  const result = await createInspection({
    ...payload,
    photo_urls: [],
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await sendEmail({
    to: payload.email,
    subject: `${SITE.name} — Inspection request received`,
    html: `<p>Hi ${payload.full_name},</p><p>We received your inspection request (Pending). Our team will contact you shortly.</p><p>— ${SITE.name}</p>`,
  });

  return NextResponse.json({ ok: true, id: result.id });
}
