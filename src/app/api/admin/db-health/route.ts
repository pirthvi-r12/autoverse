import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin/auth";
import { isDatabaseConfigured } from "@/lib/db/config";
import { getPool } from "@/lib/db/pool";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Admin-only: verify runtime TiDB connection and row counts. */
export async function GET(req: NextRequest) {
  const auth = await verifyAdminAccess(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      connected: false,
      mode: "mock",
      message: "DB_HOST / DB_USER / DB_NAME not set in this environment.",
    });
  }

  try {
    const pool = getPool();
    const [inspections] = await pool.query(
      "SELECT COUNT(*) AS n FROM inspections"
    );
    const [leads] = await pool.query("SELECT COUNT(*) AS n FROM leads");
    const [cars] = await pool.query("SELECT COUNT(*) AS n FROM cars");

    const row = (r: unknown) =>
      Number((r as { n: number }[])[0]?.n ?? 0);

    return NextResponse.json({
      connected: true,
      mode: "tidb",
      database: process.env.DB_NAME ?? "autoverse",
      ssl: process.env.DB_SSL === "true",
      counts: {
        inspections: row(inspections),
        leads: row(leads),
        cars: row(cars),
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        connected: false,
        mode: "tidb",
        error: e instanceof Error ? e.message : "Database query failed",
      },
      { status: 503 }
    );
  }
}
