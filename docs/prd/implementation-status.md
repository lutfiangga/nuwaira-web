# Implementation Status

## Completed

### Landing Page & Konten Dinamis

- Landing page dan homepage sections.
- Navbar sticky dengan conditional rendering (disembunyikan pada halaman register dan acara register).
- Carousel statis dengan autoplay kontinu dan stop on hover.
- Testimonial dan video YouTube popup autoplay.
- Homepage sections (program, benefits, facilities) dinamis dari database.
- Halaman detail program dengan intro, journey, pricing, dan FAQ.
- Program section dinamis dengan `PublicProgramSummary` type yang selaras dengan query DB.

### Acara (Events)

- Halaman publik daftar acara dan detail acara di `/acara`.
- Form pendaftaran acara dengan validasi server dan Turnstile.
- Layout bersih tanpa navbar/footer pada halaman pendaftaran acara.
- CRUD acara dari panel admin.
- Event registration dengan duplicate check per email per acara.

### Pendaftaran Siswa

- Form pendaftaran siswa modern.
- Searchable combobox reusable dan custom date picker.
- Integrasi Emsifa hingga kelurahan/desa.
- Input custom untuk opsi `Lainnya`.
- Checkbox persetujuan wajib dan Turnstile.
- Validasi client dan server.
- Tabel `students` terpisah dari akun `user`.
- NIK AES-256-GCM dan HMAC search index.
- Status intake `pending`, `accepted`, dan `rejected`.

### Admin

- Route admin `/students` untuk accepted.
- Route admin `/prospective-students` untuk pending.
- Aksi menerima/menolak pada daftar dan detail.
- Search debounce dan pagination server-side.
- Export CSV, Excel, PDF dan hide/show columns pada siswa serta calon siswa.
- Admin `/users` dengan CRUD, export, bulk delete, dan hide/show columns.
- Reusable `DataTable` component untuk seragamkan tampilan tabel admin.
- Login, logout, session cleanup, dan dashboard role-aware.

### Manajemen Program

- CRUD program dengan slug, title, summary, hero image, status.
- CRUD program intro (eyebrow, title, deskripsi, learning background, gambar).
- CRUD offerings (batch/private) dengan benefits dan schedule.
- CRUD batch dengan kapasitas, tanggal, lokasi (onsite/remote), dan status buka/tutup.
- CRUD milestones, metrics, journeys, paragraphs, checklists.
- CRUD FAQ per program.

### Manajemen Konten

- CRUD social media dengan icon selection dan bulk save.
- Validasi per-field pada social media dengan error display spesifik.
- CRUD facilities dan registration perks.
- Form social media menggunakan `use:enhance` untuk sinkronisasi data form yang reliable.

### Komponen Reusable

- Turnstile widget dengan script-once pattern dan cleanup on unmount.
- FormCombobox dengan hidden input dan error display.
- Custom table component untuk semua halaman admin.

## Database Migration

Jalankan migration sebelum memakai fitur student:

```bash
bun run db:migrate
```

## Verification Baseline

```bash
bun run check
bun run lint
bun run build
```
