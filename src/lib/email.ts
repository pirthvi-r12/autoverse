import { Resend } from "resend";
import { SITE } from "./constants";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email skipped]", params.subject, params.to);
    return { ok: true, skipped: true };
  }
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM_EMAIL ?? `AutoVerse <noreply@${SITE.name.toLowerCase()}.com>`;
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
  return { ok: !error, error: error?.message };
}
