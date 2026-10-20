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
    <div className="page-shell-narrow">
      <div className="glass-panel rounded-2xl p-5 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {SITE.name} Inspection Report
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
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
              className="flex flex-col gap-1 rounded-xl bg-white/5 px-4 py-3 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <span className="capitalize text-white/70">
                {key.replace(/_/g, " ")}
              </span>
              <span className="font-medium text-white sm:text-right">
                {val.score}/10
                {val.notes ? ` — ${val.notes}` : ""}
              </span>
            </div>
          ))}
        </div>

        {report.inspector_remarks && (
          <p className="mt-6 text-white/75">{report.inspector_remarks}</p>
        )}

        <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
          <a
            href={pdfUrl}
            className="btn-touch w-full rounded-full bg-accent text-black sm:w-auto"
          >
            Download PDF
          </a>
          <button
            type="button"
            className="btn-touch w-full rounded-full border border-white/20 text-white sm:w-auto"
            data-copy={reportUrl}
          >
            Copy report link
          </button>
          <Link
            href="/"
            className="btn-touch w-full rounded-full border border-white/10 text-accent sm:w-auto sm:border-transparent"
          >
            Back to {SITE.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
