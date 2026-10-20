import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getReportByToken } from "@/lib/data/inspections";
import { SITE } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  return {
    title: `Inspection Report | ${SITE.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const report = await getReportByToken(token);
  if (!report) notFound();

  const inspection = report.inspection;
  const reportUrl = `${SITE.url}/report/${token}`;
  const pdfUrl = `/api/reports/${token}/pdf`;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 lg:px-6">
      <div className="glass-panel rounded-2xl p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {SITE.name} Inspection Report
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          {inspection?.car_brand} {inspection?.car_model}{" "}
          {inspection?.car_year}
        </h1>
        <p className="mt-2 text-white/60">
          Prepared for {inspection?.full_name} · Rating{" "}
          <span className="text-accent">{report.rating ?? "—"}/10</span>
        </p>

        <div className="mt-8 space-y-3">
          {Object.entries(report.checklist ?? {}).map(([key, val]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 text-sm"
            >
              <span className="capitalize text-white/70">
                {key.replace(/_/g, " ")}
              </span>
              <span className="text-right text-white">
                {val.score}/10
                {val.notes ? ` — ${val.notes}` : ""}
              </span>
            </div>
          ))}
        </div>

        {report.inspector_remarks && (
          <p className="mt-6 text-white/75">{report.inspector_remarks}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={pdfUrl}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black"
          >
            Download PDF
          </a>
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
            data-copy={reportUrl}
          >
            Copy link (use share buttons in admin)
          </button>
          <Link href="/" className="text-sm text-accent">
            Back to {SITE.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
