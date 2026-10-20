export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DB_HOST?.trim() &&
      process.env.DB_NAME?.trim() &&
      process.env.DB_USER !== undefined
  );
}

export function dbSslEnabled(): boolean {
  const v = process.env.DB_SSL?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function getDatabaseConfig() {
  return {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "autoverse",
    ssl: dbSslEnabled() ? { rejectUnauthorized: true } : undefined,
  };
}
