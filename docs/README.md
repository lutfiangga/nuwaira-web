# Nuwaira Academy Documentation

Folder ini menjadi source of truth untuk scope produk dan kontrak implementasi.

## Struktur

- `docs/prd`: tujuan produk, status implementasi, dan roadmap.
- `docs/srs`: requirement fungsional, non-fungsional, dan kontrak modul.
- `docs/design-system-uml`: diagram domain, use case, activity, dan sequence.

## Arsitektur Aktif

- Runtime dan package manager: Bun.
- Framework: SvelteKit 2 dengan Svelte 5.
- Database: PostgreSQL melalui Drizzle ORM dan migration SQL.
- Route groups:
  - `(public)` untuk landing, register, login, dan logout.
  - `(shared)` untuk dashboard role-aware.
  - `(admin)` untuk siswa, calon siswa, dan manajemen user.
- Auth menggunakan Argon2, tabel `session`, dan cookie `auth-session`.
- Data lokasi Indonesia berasal dari Emsifa melalui proxy `/api/locations`.
- NIK dienkripsi AES-256-GCM dengan key turunan dari `SECRET_KEY`.
- Intake student menggunakan status `pending`, `accepted`, dan `rejected`.

## Aturan Maintenance

- Perubahan flow, route, schema, atau keamanan wajib memperbarui docs terkait.
- Setelah perubahan schema:

```bash
bun run db:generate
bun run db:migrate
```

- Setelah perubahan kode:

```bash
bun run check
bun run lint
bun run build
```

## Indeks

- [Product Requirements](prd/README.md)
- [Implementation Status](prd/implementation-status.md)
- [Roadmap](prd/roadmap.md)
- [System Requirements](srs/README.md)
- [Functional Requirements](srs/functional-requirements.md)
- [Non Functional Requirements](srs/non-functional-requirements.md)
- [Module Contract](srs/module-contract.md)
- [UML Baseline](design-system-uml/README.md)

## Komponen Reusable

- `$lib/components/custom-table/data-table.svelte` — Komponen tabel seragam untuk semua halaman admin (`/users`, `/students`, `/prospective-students`). Mendukung gradient header, search, export, column visibility, selection, pagination server-side, dan custom cell rendering via snippet. Tidak menggunakan shadow.
