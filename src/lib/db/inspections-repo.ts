import { randomBytes } from "crypto";
import type { Inspection, InspectionReport } from "@/types";
import type { RowDataPacket } from "mysql2";
import { getPool } from "./pool";
import { rowToInspection, toIso } from "./parse";
import { dbCreateLead } from "./leads-repo";

export async function dbGetInspections(): Promise<Inspection[]> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM inspections ORDER BY created_at DESC"
  );
  return rows.map(rowToInspection);
}

export async function dbGetInspectionById(
  id: string
): Promise<Inspection | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM inspections WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? rowToInspection(rows[0]) : null;
}

export async function dbCreateInspection(
  payload: Omit<Inspection, "id" | "status" | "created_at" | "updated_at">
): Promise<string> {
  const pool = getPool();
  const id = crypto.randomUUID();
  await pool.execute(
    `INSERT INTO inspections (
      id, full_name, phone, email, city, car_brand, car_model, car_year,
      registration_number, mileage, color, fuel_type, transmission,
      inspection_type, preferred_date, preferred_time, location_type,
      address, photo_urls, notes, linked_car_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      id,
      payload.full_name,
      payload.phone,
      payload.email,
      payload.city,
      payload.car_brand,
      payload.car_model,
      payload.car_year ?? null,
      payload.registration_number ?? null,
      payload.mileage ?? null,
      payload.color ?? null,
      payload.fuel_type ?? null,
      payload.transmission ?? null,
      payload.inspection_type,
      payload.preferred_date ?? null,
      payload.preferred_time ?? null,
      payload.location_type,
      payload.address ?? null,
      JSON.stringify(payload.photo_urls ?? []),
      payload.notes ?? null,
      payload.linked_car_id ?? null,
    ]
  );

  await dbCreateLead({
    type: "inspection",
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    message: payload.notes ?? null,
    metadata: { inspection_id: id },
  });

  return id;
}

export async function dbUpdateInspectionStatus(
  id: string,
  status: Inspection["status"]
): Promise<void> {
  const pool = getPool();
  await pool.execute("UPDATE inspections SET status = ? WHERE id = ?", [
    status,
    id,
  ]);
}

export async function dbCompleteInspectionWithReport(
  id: string,
  data: {
    checklist: Record<string, { score: number; notes: string }>;
    rating: number;
    inspector_remarks: string;
  }
): Promise<{ token: string } | null> {
  const pool = getPool();
  const inspection = await dbGetInspectionById(id);
  if (!inspection) return null;

  const token = randomBytes(16).toString("hex");
  const reportId = crypto.randomUUID();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE inspections SET status = 'completed' WHERE id = ?",
      [id]
    );
    await conn.execute(
      `INSERT INTO inspection_reports (
        id, inspection_id, public_token, checklist, rating, inspector_remarks,
        report_photo_urls, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, CAST('[]' AS JSON), NOW(3))
      ON DUPLICATE KEY UPDATE
        public_token = VALUES(public_token),
        checklist = VALUES(checklist),
        rating = VALUES(rating),
        inspector_remarks = VALUES(inspector_remarks),
        completed_at = VALUES(completed_at)`,
      [
        reportId,
        id,
        token,
        JSON.stringify(data.checklist),
        data.rating,
        data.inspector_remarks,
      ]
    );
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return { token };
}

function rowToReport(
  row: RowDataPacket,
  inspection?: Inspection
): InspectionReport {
  let checklist = row.checklist;
  if (typeof checklist === "string") {
    try {
      checklist = JSON.parse(checklist);
    } catch {
      checklist = {};
    }
  }
  return {
    id: String(row.id),
    inspection_id: String(row.inspection_id),
    public_token: String(row.public_token),
    checklist: (checklist ?? {}) as InspectionReport["checklist"],
    rating: row.rating != null ? Number(row.rating) : null,
    inspector_remarks:
      row.inspector_remarks != null ? String(row.inspector_remarks) : null,
    report_photo_urls: [],
    completed_at: row.completed_at ? toIso(row.completed_at) : null,
    inspection,
  };
}

export async function dbGetInspectionReportByInspectionId(
  inspectionId: string
): Promise<InspectionReport | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM inspection_reports WHERE inspection_id = ? LIMIT 1",
    [inspectionId]
  );
  if (!rows[0]) return null;
  const inspection = await dbGetInspectionById(inspectionId);
  return rowToReport(rows[0], inspection ?? undefined);
}

export async function dbGetReportByToken(
  token: string
): Promise<InspectionReport | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT r.*, i.id AS insp_id
     FROM inspection_reports r
     INNER JOIN inspections i ON i.id = r.inspection_id
     WHERE r.public_token = ?
     LIMIT 1`,
    [token]
  );
  if (!rows[0]) return null;
  const inspection = await dbGetInspectionById(String(rows[0].inspection_id));
  return rowToReport(rows[0], inspection ?? undefined);
}
