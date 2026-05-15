# SRS - Dynamic LMS

## System Context
- Public app: landing, auth, course discovery.
- Panel app: operations, authoring, governance.
- Service layer: auth, RBAC, catalog, enrollment, progress, reporting.
- Data layer: relational schema per domain module.

## Architectural Constraints
- Domain module wajib punya entry `schema.ts`.
- Tidak boleh business rule di komponen UI.
- Semua authorization lewat guard/service policy.
- Semua CRUD action harus bisa dipetakan ke `resource:action`.
