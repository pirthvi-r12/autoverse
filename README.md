# AutoVerse

Production-ready, SEO-friendly car showroom built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **MySQL** setup in [`sql/`](sql/).

## Features

- Public marketing site: hero photo showcase, featured inventory, brands, testimonials, FAQ schema, contact map
- `/cars` gallery with filters, search, sorting
- `/cars/[slug]` detail pages with gallery, WhatsApp/Call/Inspection CTAs, JSON-LD
- Inspection booking (form + honeypot + optional Resend email)
- `/admin` dashboard: cars, inspections, leads, PDF reports, `/report/[token]` (noindex)
- Runtime data: **MySQL** when `DB_*` env vars are set; otherwise in-memory mock data

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — see `.env.local` admin credentials

## Database (MySQL)

Schema and sample data are in one file: [`sql/autoverse.sql`](sql/autoverse.sql).

```bash
mysql -u root -p < sql/autoverse.sql
```

Add `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to `.env.local` (see `.env.example`).

See [`sql/README.md`](sql/README.md).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_*` contact fields | NAP, WhatsApp, city |
| `ADMIN_DEMO_EMAIL` / `ADMIN_DEMO_PASSWORD` | Admin panel login |
| `ADMIN_SESSION_SECRET` | Signs admin session cookie |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | MySQL connection |
| `RESEND_API_KEY` | Transactional email |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |

## Project structure

```
src/
  app/(marketing)/     # Public pages
  app/admin/           # Admin login + dashboard
  app/api/             # Forms, PDF, admin upload
  components/
  lib/data/            # Mock/runtime data access
sql/                   # MySQL (autoverse.sql)
public/images/         # Showroom photos
```

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
