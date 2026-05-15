# SRS - Non Functional Requirements

## Maintainability
- Semua modul mengikuti kontrak folder: `models/services/requests/forms/schema.ts`.
- Tidak ada duplikasi guard logic antar route.

## Scalability
- Permission check O(1) terhadap set permission code user.
- Menu dan capability map caching per session.

## Security
- Semua route panel wajib auth + permission guard.
- Audit log untuk perubahan role/permission/default-role.

## Performance
- Query listing wajib pagination-ready.
- Bulk action wajib batch-safe.
