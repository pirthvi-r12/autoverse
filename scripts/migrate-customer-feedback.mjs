import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

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

const sslOn = ["true", "1", "yes"].includes(
  (process.env.DB_SSL ?? "").toLowerCase()
);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME,
  ssl: sslOn ? { rejectUnauthorized: true } : undefined,
});

try {
  await pool.query(
    "ALTER TABLE cars ADD COLUMN customer_feedback TEXT NULL AFTER description"
  );
  console.log("Added cars.customer_feedback");
} catch (e) {
  if (e.code === "ER_DUP_FIELDNAME") {
    console.log("Column customer_feedback already exists — OK");
  } else {
    throw e;
  }
} finally {
  await pool.end();
}
