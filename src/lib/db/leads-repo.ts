import type { Lead } from "@/types";
import type { RowDataPacket } from "mysql2";
import { getPool } from "./pool";
import { rowToLead } from "./parse";

export async function dbCreateLead(
  lead: Omit<Lead, "id" | "created_at"> & { id?: string }
): Promise<string> {
  const pool = getPool();
  const id = lead.id ?? crypto.randomUUID();
  await pool.execute(
    `INSERT INTO leads (id, type, full_name, email, phone, message, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      lead.type,
      lead.full_name ?? null,
      lead.email ?? null,
      lead.phone ?? null,
      lead.message ?? null,
      JSON.stringify(lead.metadata ?? {}),
    ]
  );
  return id;
}

export async function dbGetLeads(): Promise<Lead[]> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM leads ORDER BY created_at DESC"
  );
  return rows.map(rowToLead);
}
