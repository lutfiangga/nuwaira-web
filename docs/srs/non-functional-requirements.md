# Non Functional Requirements

## Maintainability
- Setiap modul wajib punya `schema.ts` sebagai entry export.
- Policy guard tidak boleh duplikasi hardcode permission.
- RBAC harus config/data-driven agar role/permission/menu/route bisa berubah tanpa edit code.

## Reliability
- Semua operasi RBAC CRUD harus validasi input (schema validation).
- Semua relasi RBAC wajib pakai FK + unique constraint.
- Delete data RBAC harus menjaga integritas referensi.

## Security
- Semua route panel wajib:
  - authenticated
  - authorized via route-permission resolver
- Password wajib hash Argon2.
- Role `superadmin` tidak boleh hilang dari sistem.

## Performance
- Data menu dan access profile harus bisa dibaca cepat (query terindeks).
- Daftar RBAC settings harus efisien untuk panel admin (batched query).

## Scalability
- Penambahan modul baru tidak boleh butuh perubahan auth core.
- Penambahan route baru cukup tambah registry mapping + permission.
