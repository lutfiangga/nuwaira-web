# Implementation Status

## Completed

- Route group aktif:
  - `src/routes/(public)`
  - `src/routes/(shared)`
  - `src/routes/(admin)`
- Landing page tetap tersedia.
- Register bootcamp dua step.
- Input pendidikan custom ketika memilih `Lainnya`.
- Upload foto opsional.
- Foto register dikompres dan dikonversi ke WebP di browser.
- Upload foto ke Cloudinary dengan folder prefix dari env.
- Login menggunakan email.
- Logout menghapus session user.
- Login baru menghapus session lama user yang sama.
- Dashboard shared role-aware.
- Admin panel memakai sidebar.
- Student panel memakai sidebar.
- Admin users CRUD dasar.
- Seeder hanya membuat admin user.
- User schema disederhanakan: role disimpan langsung di tabel `user`.

## Needs DB Sync

Jalankan setelah pull/change schema:

```bash
bun run db:push
```

## Verification Baseline

```bash
bun run check
bun run build
```
