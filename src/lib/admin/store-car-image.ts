import fs from "fs/promises";
import path from "path";

export function safeCarIdSegment(carId: string) {
  return carId.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 80);
}

export async function storeCarImageFile(
  carId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const segment = safeCarIdSegment(carId);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (blobToken) {
    const { put } = await import("@vercel/blob");
    const key = `cars/${segment}/${fileName}`;
    const blob = await put(key, buffer, {
      access: "public",
      contentType,
      token: blobToken,
    });
    return blob.url;
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Vercel Blob is not connected. In Vercel → Project → Storage → Create Blob store → Connect to autoverse."
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", "cars", segment);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return `/uploads/cars/${segment}/${fileName}`;
}
