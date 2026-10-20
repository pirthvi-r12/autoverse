/**
 * Inserts cover photos for sold cars that have zero car_images rows.
 * Run: node scripts/fix-sold-car-images.mjs
 */
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

if (!process.env.DB_HOST) {
  console.error("DB_* not configured in .env.local");
  process.exit(1);
}

const sslOn = ["true", "1", "yes"].includes(
  (process.env.DB_SSL ?? "").toLowerCase()
);

const FALLBACK =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=810&q=80&auto=format";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME,
  ssl: sslOn ? { rejectUnauthorized: true } : undefined,
});

const [rows] = await pool.query(
  `SELECT c.id, c.name, c.slug
   FROM cars c
   LEFT JOIN car_images i ON i.car_id = c.id
   WHERE c.status = 'sold'
   GROUP BY c.id, c.name, c.slug
   HAVING COUNT(i.id) = 0`
);

let inserted = 0;
for (const row of rows) {
  await pool.execute(
    `INSERT INTO car_images (id, car_id, url, alt_text, sort_order, is_cover)
     VALUES (?, ?, ?, ?, 0, 1)`,
    [randomUUID(), row.id, FALLBACK, `${row.name} — cover`]
  );
  inserted += 1;
  console.log("Added cover for sold car:", row.name, row.slug);
}

await pool.end();
console.log(inserted ? `Done. ${inserted} sold car(s) updated.` : "No sold cars missing images.");
