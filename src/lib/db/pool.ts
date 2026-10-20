import mysql from "mysql2/promise";
import { getDatabaseConfig, isDatabaseConfigured } from "./config";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured (set DB_HOST, DB_USER, DB_NAME).");
  }
  if (!pool) {
    const cfg = getDatabaseConfig();
    pool = mysql.createPool({
      ...cfg,
      waitForConnections: true,
      connectionLimit: 10,
      enableKeepAlive: true,
    });
  }
  return pool;
}
