# Nuwaira Academy

Aplikasi SvelteKit untuk landing page Nuwaira Academy, pendaftaran calon siswa, autentikasi, dan panel administrasi intake.

## Stack

- Bun
- SvelteKit 2 dan Svelte 5
- TypeScript
- Drizzle ORM dan PostgreSQL
- Tailwind CSS dan komponen berbasis shadcn-svelte
- Cloudflare Turnstile
- Cloudinary untuk foto user
- Emsifa API Wilayah Indonesia

## Fitur Utama

- Landing page publik dengan navbar sticky, carousel, program, dan testimonial.
- Form pendaftaran modern dengan:
  - searchable combobox reusable
  - custom calendar
  - provinsi, kabupaten/kota, kecamatan, dan kelurahan dari Emsifa
  - input custom ketika memilih `Lainnya`
  - persetujuan wajib dan Cloudflare Turnstile
- NIK dienkripsi menggunakan AES-256-GCM dan hanya didekripsi pada server.
- Pencarian NIK menggunakan HMAC index, bukan plaintext.
- Workflow pendaftaran:
  - registrasi baru berstatus `pending`
  - admin menerima pendaftar menjadi `accepted`
  - admin dapat menolak pendaftar menjadi `rejected`
- Panel admin:
  - `/dashboard`
  - `/students` untuk siswa `accepted`, export, dan hide/show columns
  - `/prospective-students` untuk calon siswa `pending`, approval, export, dan hide/show columns
  - `/users` untuk CRUD user, export, bulk delete, dan hide/show columns
- Search daftar admin menggunakan debounce 500 ms dan pagination server-side.
- Dashboard shared di `/dashboard` untuk admin dan student.

## Route Groups

- `src/routes/(public)`: landing, register, login, dan logout.
- `src/routes/(shared)`: dashboard role-aware.
- `src/routes/(admin)`: dashboard admin, siswa, calon siswa, dan users.

## Environment

Salin `.env.example` menjadi `.env`, lalu isi:

```bash
DATABASE_URL="postgres://user:password@host:port/db-name"

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_FOLDER_PREFIX=nuwaira

PUBLIC_TURNSTILE_SITE_KEY=xxx
TURNSTILE_SECRET_KEY=xxx

SECRET_KEY=replace-with-a-long-random-secret-key
```

`SECRET_KEY` wajib minimal 32 karakter. Gunakan nilai random yang stabil karena perubahan key membuat NIK lama tidak dapat didekripsi.

```bash
openssl rand -base64 48
```

## Development

```bash
bun install
bun run db:migrate
bun run db:seed
bun run dev
```

Default seed admin:

- Email: `admin@nuwaira.id`
- Password: `password`
- Role: `admin`

## Database

Tabel aktif:

- `user`: akun, role, profil dasar, dan password hash.
- `session`: session autentikasi.
- `students`: data pendaftaran, domisili, wali, NIK terenkripsi, dan status intake.

Status student:

- `pending`: calon siswa menunggu review.
- `accepted`: siswa diterima dan tampil di `/students`.
- `rejected`: pendaftaran ditolak dan tetap tersimpan sebagai riwayat.

Setelah mengubah schema:

```bash
bun run db:generate
bun run db:migrate
```

## Verification

```bash
bun run check
bun run lint
bun run build
```

## Docs

Dokumentasi produk, requirement, kontrak teknis, dan diagram tersedia di [docs](docs/README.md).
