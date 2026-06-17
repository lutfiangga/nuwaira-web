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
  - `(public)` untuk landing, register, login, logout, acara, dan detail program.
  - `(shared)` untuk dashboard role-aware dan attendance.
  - `(admin)` untuk siswa, calon siswa, users, program, acara, konten, dan enrollment.
- Auth menggunakan Argon2, tabel `session`, dan cookie `auth-session`.
- Data lokasi Indonesia berasal dari Emsifa melalui proxy `/api/locations`.
- NIK dienkripsi AES-256-GCM dengan key turunan dari `SECRET_KEY`.
- Intake student menggunakan status `pending`, `accepted`, dan `rejected`.
- Manajemen program: CRUD program, intro, offerings, batches, milestones, metrics, journeys, paragraphs, checklists, FAQ.
- Manajemen acara: CRUD acara publik, pendaftaran acara dengan Turnstile.
- Konten dinamis: homepage sections, social media, facilities, registration perks dari database.
- Navbar dan footer disembunyikan pada halaman pendaftaran (register siswa dan acara).
- Turnstile widget menggunakan pattern script-once dengan cleanup on unmount.

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

