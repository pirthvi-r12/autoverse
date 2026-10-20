import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getReportByToken } from "@/lib/data/inspections";
import { InspectionReportDocument } from "@/lib/pdf/inspection-report-document";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const report = await getReportByToken(token);
  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <InspectionReportDocument report={report} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="autoverse-inspection-${token.slice(0, 8)}.pdf"`,
    },
  });
}
