# Nuwaira Academy

Web app SvelteKit untuk landing page Nuwaira Academy, pendaftaran siswa bootcamp, login, dan panel sederhana untuk admin serta siswa.

## Stack

- Bun
- SvelteKit 2 + Svelte 5
- TypeScript
- Drizzle ORM + PostgreSQL
- Tailwind CSS + shadcn-svelte style components
- Cloudinary untuk upload foto

## Current Scope

- Landing page publik.
- Register siswa bootcamp dua step:
  - Step 1: nama, jalur personal/business, pendidikan, motivasi, no HP.
  - Step 2: email, password, konfirmasi password, foto opsional.
- Pendidikan `Lainnya` membuka input custom.
- `companyName` hanya wajib untuk jalur business.
- Foto pendaftaran dikompres dan dikonversi ke WebP di browser sebelum upload.
- Foto disimpan ke Cloudinary, bukan local server.
- Login menggunakan email + password.
- Dashboard shared di `/dashboard`:
  - admin melihat dashboard operasional.
  - student melihat dashboard profil pendaftaran.
- Admin panel:
  - dashboard
  - users
- Session cleanup:
  - login baru menghapus session lama user yang sama.
  - logout menghapus session aktif dari tabel `session`.

## Route Groups

- `src/routes/(public)`: landing, register, login, logout.
- `src/routes/(shared)`: dashboard yang dipakai admin dan student.
- `src/routes/(admin)`: halaman admin-only seperti `/users`.

## Environment

Copy `.env.example` ke `.env`, lalu isi:

```bash
DATABASE_URL="postgres://user:password@host:port/db-name"
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_FOLDER_PREFIX=nuwaira
```

`CLOUDINARY_FOLDER_PREFIX` dipakai sebagai prefix folder upload. Contoh hasil folder:

- `nuwaira/bootcamp-students`
- `nuwaira/users`

## Development

```bash
bun install
bun run db:push
bun run db:seed
bun run dev
```

Default seed admin:

- Email: `admin@nuwaira.id`
- Password: `password`
- Role: `admin`

## Verification

```bash
bun run check
bun run build
```

## Database Notes

Schema aktif saat ini hanya fokus pada:

- `user`
- `session`

Kolom penting `user`:

- `id`
- `email`
- `role`
- `name`
- `phone`
- `education`
- `motivation`
- `student_type`
- `company_name`
- `photo`
- `password_hash`

Setelah perubahan schema, jalankan:

```bash
bun run db:push
```

## Docs

Dokumentasi project ada di [docs](docs/README.md).
