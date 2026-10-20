import { isDatabaseConfigured } from "@/lib/db/config";
import {
  dbCompleteInspectionWithReport,
  dbCreateInspection,
  dbGetInspectionById,
  dbGetInspectionReportByInspectionId,
  dbGetInspections,
  dbGetReportByToken,
  dbUpdateInspectionStatus,
} from "@/lib/db/inspections-repo";
import { dbGetLeads } from "@/lib/db/leads-repo";
import {
  MOCK_INSPECTIONS,
  MOCK_LEADS,
  MOCK_REPORTS,
} from "@/lib/mock-data";
import { DEFAULT_CHECKLIST } from "@/lib/constants";
import type { Inspection, InspectionReport, Lead } from "@/types";
import { randomBytes } from "crypto";

export async function getInspections(): Promise<Inspection[]> {
  if (isDatabaseConfigured()) {
    return dbGetInspections();
  }
  return [...MOCK_INSPECTIONS].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getInspectionById(id: string): Promise<Inspection | null> {
  if (isDatabaseConfigured()) {
    return dbGetInspectionById(id);
  }
  return MOCK_INSPECTIONS.find((i) => i.id === id) ?? null;
}

export async function createInspection(
  payload: Omit<Inspection, "id" | "status" | "created_at" | "updated_at">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    if (isDatabaseConfigured()) {
      const id = await dbCreateInspection(payload);
      return { ok: true, id };
    }
    const id = crypto.randomUUID();
    const record: Inspection = {
      ...payload,
      id,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    MOCK_INSPECTIONS.unshift(record);
    MOCK_LEADS.unshift({
      id: crypto.randomUUID(),
      type: "inspection",
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      message: payload.notes ?? null,
      metadata: { inspection_id: id },
      created_at: new Date().toISOString(),
    });
    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not save inspection",
    };
  }
}

export async function updateInspectionStatus(
  id: string,
  status: Inspection["status"]
) {
  try {
    if (isDatabaseConfigured()) {
      await dbUpdateInspectionStatus(id, status);
      return { ok: true };
    }
    const item = MOCK_INSPECTIONS.find((i) => i.id === id);
    if (item) item.status = status;
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Update failed",
    };
  }
}

export async function completeInspectionWithReport(
  id: string,
  data: {
    checklist: Record<string, { score: number; notes: string }>;
    rating: number;
    inspector_remarks: string;
  }
): Promise<{ ok: boolean; token?: string; error?: string }> {
  if (isDatabaseConfigured()) {
    const result = await dbCompleteInspectionWithReport(id, data);
    if (!result) return { ok: false, error: "Not found" };
    return { ok: true, token: result.token };
  }
  const token = randomBytes(16).toString("hex");
  const inspection = MOCK_INSPECTIONS.find((i) => i.id === id);
  if (!inspection) return { ok: false, error: "Not found" };
  inspection.status = "completed";
  MOCK_REPORTS.set(id, {
    token,
    inspection_id: id,
    ...data,
  });
  return { ok: true, token };
}

export async function getInspectionReportByInspectionId(
  inspectionId: string
): Promise<InspectionReport | null> {
  if (isDatabaseConfigured()) {
    return dbGetInspectionReportByInspectionId(inspectionId);
  }
  const report = MOCK_REPORTS.get(inspectionId);
  if (!report) return null;
  const inspection = MOCK_INSPECTIONS.find((i) => i.id === inspectionId);
  return {
    id: inspectionId,
    inspection_id: inspectionId,
    public_token: report.token,
    checklist: report.checklist,
    rating: report.rating,
    inspector_remarks: report.inspector_remarks,
    report_photo_urls: [],
    completed_at: new Date().toISOString(),
    inspection: inspection ?? undefined,
  };
}

export async function getReportByToken(
  token: string
): Promise<InspectionReport | null> {
  if (isDatabaseConfigured()) {
    return dbGetReportByToken(token);
  }
  for (const [inspectionId, report] of MOCK_REPORTS.entries()) {
    if (report.token === token) {
      const inspection = MOCK_INSPECTIONS.find((i) => i.id === inspectionId);
      return {
        id: inspectionId,
        inspection_id: inspectionId,
        public_token: token,
        checklist: report.checklist,
        rating: report.rating,
        inspector_remarks: report.inspector_remarks,
        report_photo_urls: [],
        completed_at: new Date().toISOString(),
        inspection: inspection ?? undefined,
      };
    }
  }
  return null;
}

export async function getLeads(): Promise<Lead[]> {
  if (isDatabaseConfigured()) {
    return dbGetLeads();
  }
  return [...MOCK_LEADS].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function emptyChecklist() {
  return structuredClone(DEFAULT_CHECKLIST);
}
