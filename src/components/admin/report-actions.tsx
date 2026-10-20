"use client";

export function ReportActions({
  token,
  siteUrl,
}: {
  token: string | null;
  siteUrl: string;
}) {
  if (!token) {
    return (
      <p className="text-sm text-white/50">
        Complete the checklist above to generate a public report link and PDF.
      </p>
    );
  }

  const url = `${siteUrl}/report/${token}`;
  const pdf = `/api/reports/${token}/pdf`;

  return (
    <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
      <button
        type="button"
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black"
        onClick={() => navigator.clipboard.writeText(url)}
      >
        Copy link
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`Inspection report: ${url}`)}`}
        className="rounded-full border border-white/20 px-4 py-2 text-sm"
      >
        Share WhatsApp
      </a>
      <a href={pdf} className="rounded-full border border-white/20 px-4 py-2 text-sm">
        Download PDF
      </a>
    </div>
  );
}
