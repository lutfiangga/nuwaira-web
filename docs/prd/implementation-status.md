# Implementation Status

## Completed

- Landing page dan homepage sections.
- Navbar sticky.
- Carousel statis dengan autoplay kontinu dan stop on hover.
- Testimonial dan video YouTube popup autoplay.
- Form pendaftaran siswa modern.
- Searchable combobox reusable dan custom date picker.
- Integrasi Emsifa hingga kelurahan/desa.
- Input custom untuk opsi `Lainnya`.
- Checkbox persetujuan wajib dan Turnstile.
- Validasi client dan server.
- Tabel `students` terpisah dari akun `user`.
- NIK AES-256-GCM dan HMAC search index.
- Status intake `pending`, `accepted`, dan `rejected`.
- Route admin `/students` untuk accepted.
- Route admin `/prospective-students` untuk pending.
- Aksi menerima/menolak pada daftar dan detail.
- Search debounce dan pagination server-side.
- Export CSV, Excel, PDF dan hide/show columns pada siswa serta calon siswa.
- Admin `/users` dengan CRUD, export, bulk delete, dan hide/show columns.
- Reusable `DataTable` component di `$lib/components/custom-table/data-table.svelte` untuk seragamkan tampilan tabel di semua halaman admin tanpa shadow.
- Login, logout, session cleanup, dan dashboard role-aware.

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
