# AutoVerse database (MySQL)

Single setup file: [`autoverse.sql`](autoverse.sql) (schema + seed).

```bash
mysql -u root -p < sql/autoverse.sql
```

Set these in `.env.local` (see `.env.example`):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_SSL=true` for TiDB Cloud and other managed MySQL (TLS)

## Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin/staff accounts (future DB auth) |
| `cars` | Inventory |
| `car_images` | Gallery URLs per car |
| `inspections` | Customer inspection bookings |
| `inspection_reports` | Checklist + public report token |
| `leads` | Contact, newsletter, inspection lead log |

When `DB_*` variables are set, the Next.js app reads and writes these tables. Without them, it falls back to in-memory mock data.

Admin login still uses `ADMIN_DEMO_EMAIL` / `ADMIN_DEMO_PASSWORD` in `.env.local`.
