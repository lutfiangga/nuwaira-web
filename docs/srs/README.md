# SRS - Nuwaira Academy

## System Context

- Public app: landing, register, login, logout, acara, dan detail program.
- Shared panel: `/dashboard` dan `/attendance`, role-aware untuk admin dan student.
- Admin app: `/students`, `/prospective-students`, `/users`, `/programs`, `/events`, `/enrollments`, dan konten.
- Service layer: auth, user, student, program, event, content, location, encryption, Cloudinary, dan Turnstile.
- Data layer: PostgreSQL dan Drizzle ORM.

## Runtime

Command utama menggunakan Bun:

```bash
bun run dev
bun run check
bun run lint
bun run build
bun run db:generate
bun run db:migrate
bun run db:seed
```

## Auth Contract

- Login menggunakan email dan password.
- Password di-hash dengan Argon2.
- Session disimpan di tabel `session` dan cookie `auth-session`.
- Login baru menghapus session lama user yang sama.
- Logout menghapus session aktif.

## Student Intake Contract

- Registrasi membuat akun dengan role `student`.
- Lifecycle pendaftaran disimpan terpisah di `students.status`.
- Status valid: `pending`, `accepted`, dan `rejected`.
- Registrasi baru wajib berstatus `pending`.
- Hanya admin yang dapat mengubah status intake.

## Sensitive Data Contract

- NIK plaintext tidak boleh disimpan ke database.
- `students.nik_encrypted` menyimpan payload AES-256-GCM.
- `students.nik_hash` menyimpan HMAC SHA-256 untuk duplicate check dan exact search.
- `SECRET_KEY` wajib private, minimal 32 karakter, dan stabil antar-deployment.

## External Services

- Emsifa: data provinsi sampai kelurahan/desa.
- Cloudflare Turnstile: validasi anti-bot form register siswa dan acara.
- Cloudinary: upload gambar (user, program, acara, facilities).

## Delivery Rule

- Perubahan requirement wajib memperbarui docs.
- Perubahan schema wajib menghasilkan dan menjalankan migration.
- Perubahan route/layout wajib lolos check, lint, dan build.
