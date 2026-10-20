-- AutoVerse MySQL / TiDB — schema + seed (single file)
-- Fresh DB:  mysql -u USER -p -h HOST -P 4000 < sql/autoverse.sql
-- TiDB Cloud: set DB_SSL=true in .env.local; run full file OR bottom "TiDB migrate" block only.
--
-- Database-backed: cars, car_images, sold_deliveries, inspections, inspection_reports, leads,
--   admin_users, service_* (PPF / ceramic registry).
--
-- /cars filters (brand, fuel, transmission, body, price, year, sort):
--   App filters in memory today (src/lib/filter-cars.ts). These columns + indexes match that logic
--   and keep seed values consistent (Petrol / Diesel / Hybrid, status available|sold|reserved).
--   Public inventory excludes cars.status = 'sold'; "Sold" tab uses sold_deliveries (mirror: sold-deliveries.ts).
--
-- PPF / ceramic pages (content still in repo TS + public/images/*; DB = registry + packages for TiDB/admin):
--   /ppf              → src/lib/ppf-services.ts
--   /ceramic-coating  → src/lib/ceramic-coating.ts
-- Bookings: 0335-7344294 · WhatsApp 923357344294 · D.H.A Phase 2 Ext, Karachi

CREATE DATABASE IF NOT EXISTS autoverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autoverse;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'admin',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS cars (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  mileage INT NOT NULL DEFAULT 0,
  fuel_type VARCHAR(80) NOT NULL,
  transmission VARCHAR(80) NOT NULL,
  engine_capacity VARCHAR(80) NULL,
  color VARCHAR(80) NULL,
  body_type VARCHAR(80) NOT NULL,
  registration_city VARCHAR(120) NULL,
  owners INT NULL DEFAULT 1,
  `condition` VARCHAR(80) NULL,
  features JSON NOT NULL,
  description TEXT NULL,
  customer_feedback TEXT NULL,
  status ENUM('available', 'sold', 'reserved') NOT NULL DEFAULT 'available',
  video_url TEXT NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CHECK (year >= 1980 AND year <= 2100),
  CHECK (price >= 0)
);

CREATE INDEX cars_brand_idx ON cars (brand);
CREATE INDEX cars_status_idx ON cars (status);
CREATE INDEX cars_year_idx ON cars (year);
CREATE INDEX cars_price_idx ON cars (price);
CREATE INDEX cars_fuel_type_idx ON cars (fuel_type);
CREATE INDEX cars_body_type_idx ON cars (body_type);
CREATE INDEX cars_transmission_idx ON cars (transmission);
CREATE INDEX cars_status_created_idx ON cars (status, created_at);
CREATE INDEX cars_brand_status_idx ON cars (brand, status);

CREATE TABLE IF NOT EXISTS car_images (
  id CHAR(36) PRIMARY KEY,
  car_id CHAR(36) NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_cover TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT car_images_car_fk FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);

CREATE INDEX car_images_car_id_idx ON car_images (car_id);

CREATE TABLE IF NOT EXISTS inspections (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  car_brand VARCHAR(120) NOT NULL,
  car_model VARCHAR(120) NOT NULL,
  car_year INT NULL,
  registration_number VARCHAR(80) NULL,
  mileage INT NULL,
  color VARCHAR(80) NULL,
  fuel_type VARCHAR(80) NULL,
  transmission VARCHAR(80) NULL,
  inspection_type ENUM('basic', 'standard', 'full_premium') NOT NULL DEFAULT 'standard',
  preferred_date DATE NULL,
  preferred_time VARCHAR(40) NULL,
  location_type ENUM('showroom', 'home_visit') NOT NULL DEFAULT 'showroom',
  address TEXT NULL,
  photo_urls JSON NOT NULL,
  notes TEXT NULL,
  linked_car_id CHAR(36) NULL,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled', 'rescheduled') NOT NULL DEFAULT 'pending',
  honeypot VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT inspections_car_fk FOREIGN KEY (linked_car_id) REFERENCES cars (id) ON DELETE SET NULL
);

CREATE INDEX inspections_status_idx ON inspections (status);
CREATE INDEX inspections_created_at_idx ON inspections (created_at);

CREATE TABLE IF NOT EXISTS inspection_reports (
  id CHAR(36) PRIMARY KEY,
  inspection_id CHAR(36) NOT NULL UNIQUE,
  public_token VARCHAR(64) NOT NULL UNIQUE,
  checklist JSON NOT NULL,
  rating DECIMAL(3, 1) NULL,
  inspector_remarks TEXT NULL,
  report_photo_urls JSON NOT NULL,
  pdf_storage_path TEXT NULL,
  completed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT inspection_reports_insp_fk FOREIGN KEY (inspection_id) REFERENCES inspections (id) ON DELETE CASCADE
);

CREATE INDEX inspection_reports_token_idx ON inspection_reports (public_token);

CREATE TABLE IF NOT EXISTS leads (
  id CHAR(36) PRIMARY KEY,
  type ENUM('contact', 'newsletter', 'inspection', 'ppf', 'ceramic_coating') NOT NULL,
  full_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(40) NULL,
  message TEXT NULL,
  metadata JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE INDEX leads_type_idx ON leads (type);
CREATE INDEX leads_created_at_idx ON leads (created_at);

-- Sold & delivered handovers — powers /cars filter status=sold (app reads sold-deliveries.ts today; keep in sync).
CREATE TABLE IF NOT EXISTS sold_deliveries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(120) NOT NULL,
  year INT NOT NULL,
  image_path TEXT NOT NULL,
  feedback TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHECK (year >= 1980 AND year <= 2100)
);

CREATE INDEX sold_deliveries_sort_idx ON sold_deliveries (sort_order);
CREATE INDEX sold_deliveries_year_idx ON sold_deliveries (year);

-- Registry of public marketing / detailing pages (metadata mirror; content lives in repo).
CREATE TABLE IF NOT EXISTS service_pages (
  slug VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  public_path VARCHAR(120) NOT NULL,
  config_path VARCHAR(255) NOT NULL COMMENT 'Source-of-truth TS module in repo',
  images_dir VARCHAR(255) NULL COMMENT 'Under public/, e.g. images/ppf',
  booking_phone VARCHAR(40) NOT NULL DEFAULT '0335-7344294',
  booking_whatsapp VARCHAR(24) NOT NULL DEFAULT '923357344294',
  booking_location VARCHAR(255) NOT NULL DEFAULT 'D.H.A Phase 2 Ext, Karachi',
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

-- PPF / ceramic film products (Miracle, Stealth, 3M).
CREATE TABLE IF NOT EXISTS service_films (
  id VARCHAR(64) PRIMARY KEY,
  service_category ENUM('ppf', 'ceramic_coating') NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(255) NULL,
  tagline VARCHAR(255) NULL,
  substrate VARCHAR(120) NULL,
  lifespan VARCHAR(80) NULL,
  warranty VARCHAR(80) NULL,
  warranty_covers TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX service_films_category_idx ON service_films (service_category);

-- Quote packages shown on /ppf and /ceramic-coating.
CREATE TABLE IF NOT EXISTS service_packages (
  id VARCHAR(64) PRIMARY KEY,
  service_page_slug VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price_label VARCHAR(120) NOT NULL,
  tagline VARCHAR(255) NULL,
  features JSON NOT NULL,
  is_highlighted TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT service_packages_page_fk FOREIGN KEY (service_page_slug) REFERENCES service_pages (slug) ON DELETE CASCADE
);

CREATE INDEX service_packages_page_idx ON service_packages (service_page_slug);

-- Portfolio jobs (PPF / ceramic) — reference data; galleries ship in public/images/*.
CREATE TABLE IF NOT EXISTS service_portfolio_jobs (
  id CHAR(36) PRIMARY KEY,
  service_category ENUM('ppf', 'ceramic_coating') NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE,
  vehicle_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  film_brand VARCHAR(120) NULL,
  hero_image TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE INDEX service_portfolio_category_idx ON service_portfolio_jobs (service_category);
CREATE INDEX service_portfolio_sort_idx ON service_portfolio_jobs (sort_order);

INSERT IGNORE INTO admin_users (id, email, password_hash, full_name, role)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'admin@autoverse.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'AutoVerse Admin',
  'admin'
);

INSERT IGNORE INTO cars (
  id, slug, name, brand, model, year, price, mileage, fuel_type, transmission,
  engine_capacity, color, body_type, registration_city, owners, `condition`,
  features, description, status, is_featured
) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'toyota-corolla-2021-a1b2c3d4', 'Toyota Corolla Altis X Grande 1.8', 'Toyota', 'Corolla', 2021, 4850000, 42000, 'Petrol', 'Automatic', '1.8L', 'Black', 'Sedan', 'Karachi', 1, 'Excellent', '["Altis X 1.8","Sunroof","Leather Interior","Ceramic Coated"]', 'Black Altis Grande at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'suzuki-alto-2022-a1b2c3d4', 'Suzuki Alto VXL', 'Suzuki', 'Alto', 2022, 2150000, 18000, 'Petrol', 'Manual', '660cc', 'Red', 'Hatchback', 'Karachi', 1, 'Excellent', '["ABS","Airbags"]', 'Compact city car.', 'sold', 0),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'kia-sportage-2023-a1b2c3d4', 'Kia Sportage AWD', 'Kia', 'Sportage', 2023, 8900000, 12000, 'Petrol', 'Automatic', '2.0L', 'White', 'SUV', 'Karachi', 1, 'Excellent', '["AWD","Panoramic Roof","ADAS","Ceramic Coated","Premium Detailing"]', 'White Kia Sportage AWD at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'hyundai-tucson-2022-a1b2c3d4', 'Hyundai Tucson HTRAC', 'Hyundai', 'Tucson', 2022, 7200000, 28000, 'Petrol', 'Automatic', '2.0L', 'Black', 'SUV', 'Karachi', 1, 'Excellent', '["HTRAC AWD","Smart Tailgate","Ceramic Coated","Tan Leather"]', 'Black Tucson HTRAC at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000006', 'mercedes-benz-w203-2005-a1b2c3d4', 'Mercedes W203', 'Mercedes-Benz', 'W203', 2005, 4200000, 95000, 'Petrol', 'Automatic', '1.8L', 'Blue', 'Sedan', 'Karachi', 2, 'Excellent', '["W203 C-Class","C 180","AMG Package","Ceramic Coated"]', 'Mercedes W203 C 180 at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'bmw-1-series-2008-a1b2c3d4', 'BMW 120i', 'BMW', '1 Series', 2008, 3800000, 88000, 'Petrol', 'Automatic', '2.0L', 'Silver', 'Hatchback', 'Karachi', 2, 'Excellent', '["120i","Automatic","Ceramic Coated","Leather Interior"]', 'BMW 120i hatchback at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'audi-a4-2018-a1b2c3d4', 'Audi A4 Premium', 'Audi', 'A4', 2018, 8700000, 62000, 'Petrol', 'Automatic', '1.4L', 'White', 'Sedan', 'Karachi', 2, 'Good', '["Virtual Cockpit"]', 'Premium German sedan.', 'sold', 0),
  ('a1b2c3d4-0001-4000-8000-000000000009', 'mg-hs-2023-a1b2c3d4', 'MG HS', 'MG', 'HS', 2023, 6400000, 9000, 'Petrol', 'Automatic', '1.5T TGI', 'Black', 'SUV', 'Karachi', 1, 'Excellent', '["1.5T TGI","360 Camera","Ceramic Coated","Red Black Interior"]', 'Black MG HS at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000010', 'changan-oshan-x7-2024-a1b2c3d4', 'Changan Oshan X7 300T', 'Changan', 'Oshan X7', 2024, 5800000, 5000, 'Petrol', 'Automatic', '1.5T (300T)', 'Black', 'SUV', 'Karachi', 1, 'Excellent', '["300T Turbo","ADAS","Panoramic Sunroof","360 Camera"]', 'Showroom black Oshan X7 at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000011', 'toyota-land-cruiser-2016-a1b2c3d4', 'Toyota Land Cruiser ZX V8', 'Toyota', 'Land Cruiser', 2016, 32000000, 78000, 'Petrol', 'Automatic', '4.6L V8', 'Black', 'SUV', 'Karachi', 1, 'Excellent', '["ZX Top Variant","4.6L V8","4WD","Ceramic Coated","Premium Detailing"]', 'Black Land Cruiser ZX V8 at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000012', 'toyota-raize-2023-a1b2c3d4', 'Toyota Raize', 'Toyota', 'Raize', 2023, 5200000, 15000, 'Petrol', 'Automatic', '1.0T', 'White', 'SUV', 'Karachi', 1, 'Excellent', '["Ceramic Coated","Turbo","Premium Detailing"]', 'Toyota Raize at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000013', 'honda-vezel-2020-a1b2c3d4', 'Honda Vezel', 'Honda', 'Vezel', 2020, 6800000, 42000, 'Hybrid', 'Automatic', NULL, 'White', 'SUV', 'Karachi', 1, 'Excellent', '["Hybrid","Glass Coated","Sunroof"]', 'Honda Vezel hybrid at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000014', 'toyota-fortuner-2022-a1b2c3d4', 'Toyota Fortuner', 'Toyota', 'Fortuner', 2022, 18500000, 35000, 'Diesel', 'Automatic', NULL, 'White', 'SUV', 'Karachi', 1, 'Excellent', '["4x4","Ceramic Coated","7 Seater"]', 'Toyota Fortuner at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000015', 'honda-accord-2008-a1b2c3d4', 'Honda Accord CL9', 'Honda', 'Accord', 2008, 4500000, 72000, 'Petrol', 'Automatic', NULL, 'Silver', 'Sedan', 'Karachi', 2, 'Excellent', '["CL9","Ceramic Coated","Leather Interior"]', 'Honda Accord CL9 at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000016', 'kia-stonic-2022-a1b2c3d4', 'Kia Stonic', 'Kia', 'Stonic', 2022, 6200000, 22000, 'Petrol', 'Automatic', NULL, 'Red', 'SUV', 'Karachi', 1, 'Excellent', '["Ceramic Coated","Compact SUV"]', 'Kia Stonic at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000017', 'toyota-mark-x-2010-a1b2c3d4', 'Toyota Mark X 300G Premium', 'Toyota', 'Mark X', 2010, 5800000, 65000, 'Petrol', 'Automatic', NULL, 'Black', 'Sedan', 'Karachi', 2, 'Excellent', '["300G Premium","Ceramic Coated","V6"]', 'Toyota Mark X at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000018', 'toyota-pixis-2020-a1b2c3d4', 'Toyota Pixis', 'Toyota', 'Pixis', 2020, 2800000, 28000, 'Petrol', 'Automatic', NULL, 'White', 'Hatchback', 'Karachi', 1, 'Excellent', '["Compact","City Car","Ceramic Coated"]', 'Toyota Pixis at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000019', 'honda-civic-2024-a1b2c3d4', 'Honda Civic', 'Honda', 'Civic', 2024, 9200000, 8000, 'Petrol', 'Automatic', NULL, 'White', 'Sedan', 'Karachi', 1, 'Excellent', '["New Shape","Ceramic Coated","Sunroof"]', 'Honda Civic at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000020', 'toyota-hilux-2023-a1b2c3d4', 'Toyota Hilux Revo', 'Toyota', 'Hilux', 2023, 16800000, 25000, 'Diesel', 'Automatic', NULL, 'White', 'Pickup', 'Karachi', 1, 'Excellent', '["Revo","4x4","Ceramic Coated"]', 'Toyota Hilux Revo at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000021', 'toyota-c-hr-2021-a1b2c3d4', 'Toyota C-HR', 'Toyota', 'C-HR', 2021, 7500000, 38000, 'Petrol', 'Automatic', NULL, 'Silver', 'SUV', 'Karachi', 1, 'Excellent', '["Crossover","Ceramic Coated"]', 'Toyota C-HR at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000022', 'honda-civic-2023-a1b2c3d4', 'Honda Civic (Black)', 'Honda', 'Civic', 2023, 8800000, 14000, 'Petrol', 'Automatic', NULL, 'Black', 'Sedan', 'Karachi', 1, 'Excellent', '["Glass Coated","Turbo"]', 'Black Honda Civic at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000023', 'mercedes-benz-c200-2015-a1b2c3d4', 'Mercedes-Benz C200', 'Mercedes-Benz', 'C200', 2015, 9500000, 55000, 'Petrol', 'Automatic', NULL, 'White', 'Sedan', 'Karachi', 2, 'Excellent', '["C200","Glass Coated","Premium Interior"]', 'Mercedes C200 at AutoVerse.', 'available', 1),
  ('a1b2c3d4-0001-4000-8000-000000000024', 'toyota-premio-2018-a1b2c3d4', 'Toyota Premio', 'Toyota', 'Premio', 2018, 5400000, 48000, 'Petrol', 'Automatic', NULL, 'White', 'Sedan', 'Karachi', 1, 'Excellent', '["Premio","Ceramic Coated"]', 'Toyota Premio at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000025', 'nissan-note-2021-a1b2c3d4', 'Nissan Note e-Power', 'Nissan', 'Note', 2021, 4900000, 32000, 'Hybrid', 'Automatic', NULL, 'White', 'Hatchback', 'Karachi', 1, 'Excellent', '["e-Power","Ceramic Coated"]', 'Nissan Note e-Power at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000026', 'toyota-corolla-2020-a1b2c3d4', 'Toyota Corolla Grande', 'Toyota', 'Corolla', 2020, 5100000, 52000, 'Petrol', 'Automatic', NULL, 'Black', 'Sedan', 'Karachi', 1, 'Excellent', '["Grande","Ceramic Coated"]', 'Toyota Corolla Grande at AutoVerse.', 'available', 0),
  ('a1b2c3d4-0001-4000-8000-000000000027', 'lexus-rx-2019-a1b2c3d4', 'Lexus RX450h', 'Lexus', 'RX', 2019, 24500000, 42000, 'Hybrid', 'Automatic', NULL, 'Black', 'SUV', 'Karachi', 1, 'Excellent', '["RX450h","Hybrid","Ceramic Coated","Luxury SUV"]', 'Lexus RX450h at AutoVerse.', 'available', 1);

INSERT INTO car_images (id, car_id, url, alt_text, sort_order, is_cover) VALUES
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000001', '/images/toyota-corolla-altis-grande/01.jpg', 'Toyota Corolla Altis Grande — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/01.jpg', 'Kia Sportage AWD — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/02.jpg', 'Kia Sportage AWD — photo 2', 1, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/03.jpg', 'Kia Sportage AWD — photo 3', 2, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/04.jpg', 'Kia Sportage AWD — photo 4', 3, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/05.jpg', 'Kia Sportage AWD — photo 5', 4, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/06.jpg', 'Kia Sportage AWD — photo 6', 5, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/07.jpg', 'Kia Sportage AWD — photo 7', 6, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/08.jpg', 'Kia Sportage AWD — photo 8', 7, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/09.jpg', 'Kia Sportage AWD — photo 9', 8, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000004', '/images/kia-sportage/10.jpg', 'Kia Sportage AWD — photo 10', 9, 0),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000005', '/images/hyundai-tucson/01.jpg', 'Hyundai Tucson HTRAC — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000006', '/images/mercedes-w203/01.jpg', 'Mercedes W203 — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000007', '/images/bmw-120i/01.jpg', 'BMW 120i — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000009', '/images/mg-hs/01.jpg', 'MG HS — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000010', '/images/changan-oshan-x7/01.jpg', 'Changan Oshan X7 — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000011', '/images/toyota-land-cruiser-zx-v8/01.jpg', 'Toyota Land Cruiser ZX V8 — photo 1', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000012', '/images/toyota-raize/01.jpg', 'Toyota Raize', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000013', '/images/honda-vezel/01.jpg', 'Honda Vezel', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000014', '/images/toyota-fortuner/01.jpg', 'Toyota Fortuner', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000015', '/images/honda-accord-cl9/01.jpg', 'Honda Accord CL9', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000016', '/images/kia-stonic/01.jpg', 'Kia Stonic', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000017', '/images/toyota-mark-x/01.jpg', 'Toyota Mark X', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000018', '/images/toyota-pixis/01.jpg', 'Toyota Pixis', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000019', '/images/honda-civic/01.jpg', 'Honda Civic', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000020', '/images/toyota-hilux-revo/01.jpg', 'Toyota Hilux Revo', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000021', '/images/toyota-chr/01.jpg', 'Toyota C-HR', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000022', '/images/honda-civic-black/01.jpg', 'Honda Civic Black', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000023', '/images/mercedes-c200/01.jpg', 'Mercedes C200', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000024', '/images/toyota-premio/01.jpg', 'Toyota Premio', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000025', '/images/nissan-note-e-power/01.jpg', 'Nissan Note e-Power', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000026', '/images/toyota-corolla-grande/01.jpg', 'Toyota Corolla Grande', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000027', '/images/lexus-rx450h/01.jpg', 'Lexus RX450h', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000003', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=810&q=80&auto=format', 'Suzuki Alto VXL — cover', 0, 1),
  (UUID(), 'a1b2c3d4-0001-4000-8000-000000000008', 'https://images.unsplash.com/photo-1603584173870-7f23fdae9283?w=810&q=80&auto=format', 'Audi A4 Premium — cover', 0, 1);

UPDATE cars SET customer_feedback = 'Perfect first car for the city — AutoVerse handled everything clearly.'
WHERE id = 'a1b2c3d4-0001-4000-8000-000000000003';
UPDATE cars SET customer_feedback = 'Premium sedan, fair price — inspection report matched the car exactly.'
WHERE id = 'a1b2c3d4-0001-4000-8000-000000000008';

-- Normalize filter facets (fuel / transmission / body) for any legacy rows you add in TiDB.
UPDATE cars SET fuel_type = 'Petrol' WHERE LOWER(fuel_type) IN ('petrol', 'gasoline');
UPDATE cars SET fuel_type = 'Diesel' WHERE LOWER(fuel_type) = 'diesel';
UPDATE cars SET fuel_type = 'Hybrid' WHERE LOWER(fuel_type) IN ('hybrid', 'e-power', 'epower');
UPDATE cars SET transmission = 'Automatic' WHERE LOWER(transmission) IN ('auto', 'automatic', 'cvt');
UPDATE cars SET transmission = 'Manual' WHERE LOWER(transmission) = 'manual';

-- ─── Sold tab / filter status=sold (showroom handovers) ─────────────────────

INSERT IGNORE INTO sold_deliveries (id, name, model, year, image_path, feedback, sort_order) VALUES
  ('pixis-2021', 'Toyota Pixis', 'Pixis', 2021, '/images/sold-deliveries/01-toyota-pixis-2021.jpg', 'Alhamdulillah — sold & delivered by AutoVerse.', 10),
  ('mira-2012', 'Daihatsu Mira', 'Mira', 2012, '/images/sold-deliveries/02-daihatsu-mira-2012.jpg', 'Another happy delivery from AutoVerse.', 20),
  ('alto-vxr-2021', 'Suzuki Alto VXR', 'Alto VXR', 2021, '/images/sold-deliveries/03-suzuki-alto-vxr-2021.jpg', 'Smooth handover — congrats to our customer!', 30),
  ('altis-se-2022', 'Toyota Corolla Altis Special Edition', 'Corolla Altis Special Edition', 2022, '/images/sold-deliveries/04-toyota-altis-special-2022.jpg', 'Sold out — premium Altis delivered.', 40),
  ('cultus-2021', 'Suzuki Cultus VXL AGS', 'Cultus VXL AGS', 2021, '/images/sold-deliveries/05-suzuki-cultus-vxl-2021.jpg', 'Delivered with AutoVerse ceremonial handover.', 50),
  ('alto-ags-2019', 'Suzuki Alto AGS', 'Alto AGS', 2019, '/images/sold-deliveries/06-suzuki-alto-ags-2019.jpg', 'Trusted city car — sold by AutoVerse.', 60),
  ('swift-glx-2025-promo', 'Suzuki Swift GLX', 'Swift GLX', 2025, '/images/sold-deliveries/07-suzuki-swift-glx-2025.jpg', 'Latest Swift GLX — sold out at AutoVerse.', 70),
  ('yaris-2020', 'Toyota Yaris 1500 ATIV', 'Yaris 1500 ATIV', 2020, '/images/sold-deliveries/08-toyota-yaris-2020.jpg', 'Congrats on your new Yaris!', 80),
  ('sportage-2020', 'Kia Sportage AWD', 'Sportage AWD', 2020, '/images/sold-deliveries/09-kia-sportage-awd-2020.jpg', 'AWD Sportage delivered — thank you for choosing AutoVerse.', 90),
  ('swift-glx-2025-delivery', 'Suzuki Swift GLX', 'Swift GLX', 2025, '/images/sold-deliveries/10-suzuki-swift-glx-2025-delivery.jpg', 'Keys handed over — another Swift GLX sold.', 100),
  ('swift-glx-2026', 'Suzuki Swift GLX', 'Swift GLX', 2026, '/images/sold-deliveries/11-suzuki-swift-glx-2026.jpg', 'Brand new Swift — delivered by AutoVerse.', 110),
  ('yaris-2021', 'Toyota Yaris 1500', 'Yaris 1500', 2021, '/images/sold-deliveries/12-toyota-yaris-2021.jpg', 'Yaris 2021 sold out — happy customer.', 120),
  ('corolla-grande-2021', 'Toyota Corolla Grande', 'Corolla Grande', 2021, '/images/sold-deliveries/13-toyota-corolla-grande-2021.jpg', 'Corolla Grande delivery — Alhamdulillah.', 130);

-- ─── Detailing / PPF / ceramic (marketing registry) ─────────────────────────

INSERT IGNORE INTO service_pages (slug, title, public_path, config_path, images_dir, booking_phone, booking_whatsapp, booking_location) VALUES
  (
    'ppf',
    'PPF — Paint Protection Film',
    '/ppf',
    'src/lib/ppf-services.ts',
    'images/ppf',
    '0335-7344294',
    '923357344294',
    'D.H.A Phase 2 Ext, Karachi'
  ),
  (
    'ceramic_coating',
    'Ceramic coating — 3M & AutoVerse',
    '/ceramic-coating',
    'src/lib/ceramic-coating.ts',
    'images/ceramic',
    '0335-7344294',
    '923357344294',
    'D.H.A Phase 2 Ext, Karachi'
  );

INSERT IGNORE INTO service_films (
  id, service_category, name, short_name, tagline, substrate, lifespan, warranty, warranty_covers, sort_order
) VALUES
  (
    'miracle-ppf',
    'ppf',
    'Miracle Paint Protection Film (PPF)',
    'Miracle Ceramic Coated PPF',
    'Self-healing paint protection film',
    'Substrate made in USA',
    'Life up to 8 years',
    '5 years warranty',
    'Warranty against bubbling, cracking, yellowing, and delamination',
    10
  ),
  (
    'stealth-ppf',
    'ppf',
    'Stealth Paint Protection Film (PPF)',
    'Stealth Ceramic Coated PPF',
    'Ceramic coated stealth finish',
    NULL,
    NULL,
    NULL,
    'Warranty against bubbling, cracking, and delamination',
    20
  ),
  (
    '3m-ceramic',
    'ceramic_coating',
    '3M Ceramic Coating',
    '3M Ceramic Coating',
    'Paint correction + ceramic protection',
    NULL,
    NULL,
    NULL,
    'Protection from dust, water spotting, bird droppings, chemicals, UV, acid rain, oxidation',
    10
  );

INSERT IGNORE INTO service_packages (
  id, service_page_slug, name, price_label, tagline, features, is_highlighted, sort_order
) VALUES
  (
    'partial-front',
    'ppf',
    'Partial Front',
    'Quote on inspection',
    'High-impact areas',
    '["Partial bonnet & bumper","Headlamps / fog lamps (optional)","Ideal for budget-conscious owners"]',
    0,
    10
  ),
  (
    'full-front',
    'ppf',
    'Full Front',
    'Quote on inspection',
    'Most popular package',
    '["Full bonnet, bumper & fenders","Mirrors & headlamps","Precision cut & wrapped edges"]',
    1,
    20
  ),
  (
    'full-body',
    'ppf',
    'Full Body',
    'Quote on inspection',
    'Maximum protection',
    '["Complete exterior panels","Door cups, sills & high-wear zones","Includes paint correction & interior detail — see bundle on site"]',
    0,
    30
  ),
  (
    'landcruiser-zx-package',
    'ceramic_coating',
    'AutoVerse ceramic coating package',
    'Quote on inspection',
    '3M correction + ceramic — SUV / luxury',
    '["3M paint correction (rubbing compound)","Finishing compound","3M ceramic coating","Interior detailing","Seats removal","Carpet washing","Roof cleaning","Engine room detailing","Wash","Wax","Chrome rust removal"]',
    1,
    10
  );

INSERT IGNORE INTO service_portfolio_jobs (
  id, service_category, slug, vehicle_name, title, film_brand, hero_image, sort_order
) VALUES
  (
    'b0000000-0000-4000-8000-000000000001',
    'ppf',
    'corolla-cross',
    'Toyota Corolla Cross',
    'Corolla Cross — Miracle PPF',
    'Miracle Ceramic Coated PPF',
    '/images/ppf/corolla-cross-01-product-hero.jpg',
    10
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    'ppf',
    'kia-sportage',
    'KIA Sportage',
    'KIA Sportage — Miracle PPF',
    'Miracle Ceramic Coated PPF',
    '/images/ppf/kia-sportage-06-miracle-hero.jpg',
    20
  ),
  (
    'b0000000-0000-4000-8000-000000000003',
    'ppf',
    'audi-a4',
    'Audi A4',
    'Audi A4 — full body Miracle PPF',
    'Miracle Paint Protection Film (PPF)',
    '/images/ppf/audi-a4-04-rear-complete.jpg',
    30
  ),
  (
    'b0000000-0000-4000-8000-000000000004',
    'ppf',
    'mg-hs',
    'MG HS',
    'MG HS — Miracle PPF protection',
    'Miracle Ceramic Coated PPF',
    '/images/ppf/mg-hs-08-front-hero.jpg',
    40
  ),
  (
    'b0000000-0000-4000-8000-000000000005',
    'ppf',
    'fortuner-2021',
    'Toyota Fortuner 2021',
    'Fortuner 2021 — Stealth PPF',
    'Stealth Ceramic Coated PPF',
    '/images/ppf/fortuner-2021-01-stealth-hero.jpg',
    50
  ),
  (
    'b0000000-0000-4000-8000-000000000006',
    'ppf',
    'hilux-rocco-gr',
    'Toyota Hilux Revo Rocco GR',
    'Rocco GR — Miracle PPF',
    'Miracle Ceramic Coated PPF',
    '/images/ppf/hilux-rocco-gr-01-miracle-hero.jpg',
    60
  ),
  (
    'b0000000-0000-4000-8000-000000000007',
    'ceramic_coating',
    'landcruiser-zx',
    'Toyota Land Cruiser ZX',
    'Land Cruiser ZX — detailed by AutoVerse',
    '3M Ceramic Coating',
    '/images/ceramic/landcruiser-zx-08-studio-front.jpg',
    10
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- TiDB / existing MySQL — run this block ONCE (skip if you ran full file on empty DB)
-- Copy sections into TiDB SQL editor; ignore "already exists" on CREATE IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- 1) Leads — PPF / ceramic inquiry types
-- ALTER TABLE leads
--   MODIFY type ENUM('contact', 'newsletter', 'inspection', 'ppf', 'ceramic_coating') NOT NULL;
--
-- 2) Filter indexes (cars listing) — skip any index that already exists
-- CREATE INDEX cars_fuel_type_idx ON cars (fuel_type);
-- CREATE INDEX cars_body_type_idx ON cars (body_type);
-- CREATE INDEX cars_transmission_idx ON cars (transmission);
-- CREATE INDEX cars_status_created_idx ON cars (status, created_at);
-- CREATE INDEX cars_brand_status_idx ON cars (brand, status);
--
-- 3) Sold deliveries + service registry — use CREATE TABLE blocks from above, then:
-- ALTER TABLE service_pages ADD COLUMN booking_whatsapp VARCHAR(24) NOT NULL DEFAULT '923357344294'
--   AFTER booking_phone;
-- UPDATE service_pages SET booking_whatsapp = '923357344294' WHERE booking_whatsapp IS NULL OR booking_whatsapp = '';
--
-- 4) Re-run INSERT IGNORE sections: sold_deliveries, service_pages, service_films,
--    service_packages, service_portfolio_jobs (safe to repeat).
--
-- 5) Sold cars missing cover images (optional — matches scripts/fix-sold-car-images.mjs)
-- INSERT INTO car_images (id, car_id, url, alt_text, sort_order, is_cover)
-- SELECT UUID(), c.id, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=810&q=80&auto=format', CONCAT(c.name, ' — cover'), 0, 1
-- FROM cars c
-- LEFT JOIN car_images i ON i.car_id = c.id
-- WHERE c.status = 'sold'
-- GROUP BY c.id, c.name
-- HAVING COUNT(i.id) = 0;
