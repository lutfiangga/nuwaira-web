# SRS - Dynamic LMS

## System Context
- Public app (`(public)`): auth + learner-facing flows.
- Panel app (`(panel)`): operational CRUD + governance RBAC.
- Service layer: business logic modular per domain.
- Data layer: PostgreSQL + Drizzle, schema per modul.

## Dynamic Governance Contract
- Authorization panel harus resolve via route-permission mapping di DB.
- Menu sidebar panel harus resolve via panel-module registry di DB.
- Role selain `superadmin` tidak boleh dipaksa ada dari code.
- Default register role harus bisa diubah dari panel RBAC.

## Delivery Rule
- Perubahan arsitektur harus update UML + SRS sebelum implementasi.
