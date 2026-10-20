import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin/auth";
import { storeCarImageFile } from "@/lib/admin/store-car-image";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const carId = String(form.get("car_id") ?? "");

    if (!carId || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing car_id or file" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, or WebP allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${Date.now()}-${safeSegment(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;

    const url = await storeCarImageFile(carId, fileName, buffer, file.type);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[car-images upload]", err);
    const message =
      err instanceof Error ? err.message : "Upload failed. Try again or use a smaller file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
