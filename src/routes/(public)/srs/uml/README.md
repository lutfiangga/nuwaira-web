# UML Design - RBAC LMS Panel

Dokumen ini jadi blueprint implementasi RBAC untuk panel LMS.

## Diagram List
- `01-usecase.md`
- `02-domain-class.md`
- `03-sequence-register-default-role.md`
- `04-sequence-panel-authorization.md`
- `05-activity-superadmin-rbac-settings.md`

## Scope RBAC
- Akses menu panel berbasis permission `resource:read`.
- Aksi CRUD berbasis permission `resource:create|read|update|delete`.
- Superadmin bisa set `default_register_role`.
- Superadmin bisa atur permission matrix per role.
