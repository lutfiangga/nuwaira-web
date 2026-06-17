# Nuwaira Academy

Aplikasi SvelteKit untuk landing page Nuwaira Academy, pendaftaran calon siswa, autentikasi, panel administrasi intake, manajemen program, acara, dan konten.

## Stack

- Bun
- SvelteKit 2 dan Svelte 5
- TypeScript
- Drizzle ORM dan PostgreSQL
- Tailwind CSS dan komponen berbasis shadcn-svelte
- Cloudflare Turnstile
- Cloudinary untuk upload gambar
- Emsifa API Wilayah Indonesia

## Fitur Utama

### Landing Page & Konten Dinamis

- Landing page publik dengan navbar sticky, carousel, program, dan testimonial.
- Homepage sections (program, benefits, facilities) dinamis dari database.
- Halaman detail program dengan intro, journey, pricing, dan FAQ.

### Acara (Events)

- Halaman publik daftar acara dan detail acara.
- Form pendaftaran acara dengan validasi server dan Turnstile.
- Layout bersih tanpa navbar/footer pada halaman pendaftaran acara.
- CRUD acara dari panel admin.

### Pendaftaran Siswa

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

### Panel Admin

- `/dashboard` — statistik ringkas.
- `/students` — siswa `accepted`, export, dan hide/show columns.
- `/prospective-students` — calon siswa `pending`, approval, export, dan hide/show columns.
- `/users` — CRUD user, export, bulk delete, dan hide/show columns.
- `/programs` — CRUD program, detail, intro, milestones, metrics, offerings, batches.
- `/events` — CRUD acara dan detail.
- `/enrollments` — daftar enrollment.
- `/faqs` — kelola FAQ.
- `/social-media` — kelola social media dengan validasi per-field.
- `/intros`, `/metrics`, `/milestones`, `/offerings`, `/batches`, `/checklists` — konten program.
- Search daftar admin menggunakan debounce 500 ms dan pagination server-side.
- Dashboard shared di `/dashboard` untuk admin dan student.

### Manajemen Konten

- CRUD program intro (eyebrow, title, deskripsi, learning background, gambar).
- CRUD offerings (batch dan private) dengan benefits dan schedule.
- CRUD batch dengan kapasitas, tanggal, lokasi (onsite/remote), dan status buka/tutup.
- CRUD milestones, metrics, journeys, paragraphs, checklists, dan FAQs.
- Social media dengan icon selection dan bulk save.

## Route Groups

- `src/routes/(public)`: landing, register, login, logout, acara, dan detail program.
- `src/routes/(shared)`: dashboard role-aware dan attendance.
- `src/routes/(admin)`: dashboard admin, siswa, calon siswa, users, program, acara, konten, dan enrollment.

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
- `programs`: program dengan slug, title, summary, hero image, dan status.
- `program_intros`: eyebrow, title, deskripsi, learning background, dan gambar per program.
- `program_offerings`: offering batch/private dengan harga, benefits, dan schedule.
- `program_batches`: batch dengan kapasitas, tanggal, lokasi (onsite/remote), dan status buka.
- `program_milestones`, `program_metrics`, `program_journeys`, `program_paragraphs`, `program_checklists`: konten program.
- `program_faqs`: FAQ per program.
- `public_events`: acara publik dengan detail, gambar, dan URL registrasi.
- `event_registrations`: pendaftaran acara dengan status.
- `enrollments`: enrollment siswa ke offering/batch.
- `facilities`: data fasilitas dengan gambar.
- `social_links`: social media dengan icon dan URL.
- `registration_perks`: perks pendaftaran.

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
