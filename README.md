# Nuwaira LMS (Dynamic)

Platform LMS berbasis SvelteKit dengan arsitektur dinamis: role, permission, menu panel, route access, dan CRUD dikontrol database registry, bukan hardcode per halaman.

## Stack
- SvelteKit 2 + Svelte 5
- TypeScript
- Drizzle ORM + PostgreSQL
- TailwindCSS + shadcn-svelte

## Core Modules (Active)
- `user`
- `rbac`
- `student`
- `bootcamp-class`
- `class-material`
- `enrollment`

## Route Groups
- Public: `src/routes/(public)`
- Panel: `src/routes/(panel)`

## Dynamic System
- Role/permission: managed dari panel RBAC.
- Menu panel: generated dari `panel_module` registry.
- Guard route: resolved dari `route_permission` registry.
- Form: schema-driven.
- Table: column-config driven.

## Quick Start
```bash
rtk npm install
rtk cp .env.example .env
rtk npm run db:push
rtk npm run check
rtk npm run dev
```

## Optional Manual SQL Migration
Jika tidak pakai `db:push`, jalankan:
- `src/lib/app/database/migrations/007_create_rbac.sql`
- `src/lib/app/database/migrations/008_create_lms_core.sql`

## Seed Data
Endpoint seeding tersedia:
- `POST /api/seed`

Output seed mencakup:
- users
- students
- classes
- materials
- enrollments

## Documentation Source of Truth
Gunakan folder root [`docs/`](docs):
- `docs/prd`
- `docs/srs`
- `docs/design-system-uml`
