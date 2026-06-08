# Nuwaira Academy Documentation

Dokumen ini adalah source of truth untuk scope aplikasi saat ini.

## Folder

- `docs/prd`: arah produk, status implementasi, roadmap.
- `docs/srs`: requirement fungsional, non-fungsional, dan kontrak implementasi.
- `docs/design-system-uml`: diagram domain, use case, activity, dan sequence.

## Current Architecture

- Runtime dan command menggunakan Bun.
- SvelteKit route group:
  - `(public)` untuk landing/auth/register.
  - `(shared)` untuk `/dashboard` yang dipakai admin dan student.
  - `(admin)` untuk halaman admin-only.
- Auth memakai session table dan cookie `auth-session`.
- Upload image wajib melalui Cloudinary.

## Maintenance Rule

- Jika route, schema, atau flow register/login berubah, update README dan docs terkait.
- Setelah schema berubah, jalankan `bun run db:push`.
- Setelah code berubah, jalankan `bun run check`; untuk perubahan route/layout, jalankan `bun run build`.

## Document Index

- [Product Requirements](prd/README.md)
- [Implementation Status](prd/implementation-status.md)
- [Roadmap](prd/roadmap.md)
- [System Requirements](srs/README.md)
- [Functional Requirements](srs/functional-requirements.md)
- [Non Functional Requirements](srs/non-functional-requirements.md)
- [Module Contract](srs/module-contract.md)
- [UML Baseline](design-system-uml/README.md)
