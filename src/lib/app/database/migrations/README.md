# Database Migrations

## Preferred
Gunakan schema-per-modul + Drizzle push:

```bash
rtk npm run db:push
```

## Manual SQL (Optional)
Jika perlu manual SQL, jalankan file berikut berurutan:

1. `007_create_rbac.sql`
2. `008_create_lms_core.sql`

Contoh:

```bash
rtk psql "$DATABASE_URL" -f src/lib/app/database/migrations/007_create_rbac.sql
rtk psql "$DATABASE_URL" -f src/lib/app/database/migrations/008_create_lms_core.sql
```
