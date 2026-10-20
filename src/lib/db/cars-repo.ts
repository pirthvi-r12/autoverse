import { carMatchesBrand } from "@/lib/filter-cars";
import type { Car, CarFilters, CarImage } from "@/types";
import type { RowDataPacket } from "mysql2";
import { getPool } from "./pool";
import { rowToCar, rowToCarImage } from "./parse";

function attachImages(cars: Car[], images: CarImage[]): Car[] {
  const byCar = new Map<string, CarImage[]>();
  for (const img of images) {
    const list = byCar.get(img.car_id) ?? [];
    list.push(img);
    byCar.set(img.car_id, list);
  }
  return cars.map((car) => ({
    ...car,
    images: (byCar.get(car.id) ?? []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

async function loadAllCars(): Promise<Car[]> {
  const pool = getPool();
  const [carRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cars ORDER BY created_at DESC"
  );
  const [imageRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM car_images ORDER BY sort_order ASC"
  );
  const images = imageRows.map(rowToCarImage);
  const cars = carRows.map((row) => rowToCar(row, []));
  return attachImages(cars, images);
}

function filterCars(cars: Car[], filters?: CarFilters): Car[] {
  let list = [...cars];
  if (!filters) return list;

  if (filters.status && filters.status !== "all") {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters.brand) {
    list = list.filter((c) => carMatchesBrand(c, filters.brand!));
  }
  if (filters.model) {
    list = list.filter((c) =>
      c.model.toLowerCase().includes(filters.model!.toLowerCase())
    );
  }
  if (filters.yearMin) list = list.filter((c) => c.year >= filters.yearMin!);
  if (filters.yearMax) list = list.filter((c) => c.year <= filters.yearMax!);
  if (filters.priceMin) list = list.filter((c) => c.price >= filters.priceMin!);
  if (filters.priceMax) list = list.filter((c) => c.price <= filters.priceMax!);
  if (filters.fuelType) {
    list = list.filter(
      (c) => c.fuel_type.toLowerCase() === filters.fuelType!.toLowerCase()
    );
  }
  if (filters.transmission) {
    list = list.filter(
      (c) =>
        c.transmission.toLowerCase() === filters.transmission!.toLowerCase()
    );
  }
  if (filters.bodyType) {
    list = list.filter(
      (c) => c.body_type.toLowerCase() === filters.bodyType!.toLowerCase()
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "year_desc":
      list.sort((a, b) => b.year - a.year);
      break;
    case "newest":
    default:
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return list;
}

export async function dbGetCars(filters?: CarFilters): Promise<Car[]> {
  return filterCars(await loadAllCars(), filters);
}

export async function dbGetPublicCars(filters?: CarFilters): Promise<Car[]> {
  const status = filters?.status ?? "available";
  return filterCars(await loadAllCars(), { ...filters, status });
}

export async function dbGetFeaturedCars(limit = 6): Promise<Car[]> {
  const all = await loadAllCars();
  return all
    .filter((c) => c.is_featured && c.status === "available")
    .slice(0, limit);
}

/** Sold cars with photos for homepage “recently sold” showcase. */
export async function dbGetSoldShowcaseCars(limit = 8): Promise<Car[]> {
  const all = await loadAllCars();
  return all
    .filter((c) => c.status === "sold")
    .sort((a, b) => {
      const aHas = (a.images?.length ?? 0) > 0 ? 1 : 0;
      const bHas = (b.images?.length ?? 0) > 0 ? 1 : 0;
      if (bHas !== aHas) return bHas - aHas;
      return (
        new Date(b.updated_at ?? b.created_at).getTime() -
        new Date(a.updated_at ?? a.created_at).getTime()
      );
    })
    .slice(0, limit);
}

export async function dbGetCarBySlug(slug: string): Promise<Car | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cars WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!rows[0]) return null;
  const [imageRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC",
    [rows[0].id]
  );
  const images = imageRows.map(rowToCarImage);
  return rowToCar(rows[0], images);
}

export async function dbGetCarById(id: string): Promise<Car | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cars WHERE id = ? LIMIT 1",
    [id]
  );
  if (!rows[0]) return null;
  const [imageRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC",
    [id]
  );
  const images = imageRows.map(rowToCarImage);
  return rowToCar(rows[0], images);
}

export async function dbUpsertCar(record: Car): Promise<void> {
  const pool = getPool();
  const conn = await pool.getConnection();
  const features = JSON.stringify(record.features ?? []);
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query<RowDataPacket[]>(
      "SELECT created_at FROM cars WHERE id = ? LIMIT 1",
      [record.id]
    );
    const createdAt = existing[0]?.created_at ?? new Date();

    await conn.execute(
      `INSERT INTO cars (
        id, slug, name, brand, model, year, price, mileage, fuel_type, transmission,
        engine_capacity, color, body_type, registration_city, owners, \`condition\`,
        features, description, customer_feedback, status, video_url, is_featured, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        slug = VALUES(slug),
        name = VALUES(name),
        brand = VALUES(brand),
        model = VALUES(model),
        year = VALUES(year),
        price = VALUES(price),
        mileage = VALUES(mileage),
        fuel_type = VALUES(fuel_type),
        transmission = VALUES(transmission),
        engine_capacity = VALUES(engine_capacity),
        color = VALUES(color),
        body_type = VALUES(body_type),
        registration_city = VALUES(registration_city),
        owners = VALUES(owners),
        \`condition\` = VALUES(\`condition\`),
        features = VALUES(features),
        description = VALUES(description),
        customer_feedback = VALUES(customer_feedback),
        status = VALUES(status),
        video_url = VALUES(video_url),
        is_featured = VALUES(is_featured)`,
      [
        record.id,
        record.slug,
        record.name,
        record.brand,
        record.model,
        record.year,
        record.price,
        record.mileage,
        record.fuel_type,
        record.transmission,
        record.engine_capacity ?? null,
        record.color ?? null,
        record.body_type,
        record.registration_city ?? null,
        record.owners ?? null,
        record.condition ?? null,
        features,
        record.description ?? null,
        record.customer_feedback ?? null,
        record.status,
        record.video_url ?? null,
        record.is_featured ? 1 : 0,
        createdAt,
      ]
    );

    await conn.execute("DELETE FROM car_images WHERE car_id = ?", [record.id]);
    for (const img of record.images ?? []) {
      await conn.execute(
        `INSERT INTO car_images (id, car_id, url, alt_text, sort_order, is_cover)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          img.id,
          record.id,
          img.url,
          img.alt_text ?? null,
          img.sort_order,
          img.is_cover ? 1 : 0,
        ]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function dbSetCarStatus(
  id: string,
  status: Car["status"]
): Promise<void> {
  const pool = getPool();
  await pool.execute("UPDATE cars SET status = ? WHERE id = ?", [status, id]);
}

export async function dbDeleteCar(id: string): Promise<void> {
  const pool = getPool();
  await pool.execute("DELETE FROM cars WHERE id = ?", [id]);
}
