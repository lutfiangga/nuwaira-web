# SRS - Nuwaira Academy

## System Context

- Public app: landing, register, login, logout.
- Shared panel: `/dashboard`, role-aware untuk admin dan student.
- Admin app: `/users`.
- Service layer: user/auth/cloudinary.
- Data layer: PostgreSQL + Drizzle.

## Runtime

- Semua command development memakai Bun.
- Script utama:
  - `bun run dev`
  - `bun run check`
  - `bun run build`
  - `bun run db:push`
  - `bun run db:seed`

## Auth Contract

- Login memakai email dan password.
- Password hash memakai Argon2.
- Session disimpan di tabel `session`.
- Cookie session memakai `auth-session`.
- Saat login, session lama user yang sama dihapus sebelum session baru dibuat.
- Saat logout, session user aktif dihapus dari tabel `session`.

## Upload Contract

- Foto tidak boleh disimpan ke local server.
- Upload foto harus memakai Cloudinary.
- Folder Cloudinary harus menggunakan `CLOUDINARY_FOLDER_PREFIX`.

## Delivery Rule

- Perubahan requirement wajib update docs.
- Perubahan schema wajib diikuti `bun run db:push`.
- Perubahan route/layout wajib diverifikasi dengan `bun run check` dan `bun run build`.
