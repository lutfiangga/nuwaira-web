# Module Contract

## Domain Module Structure
Setiap modul domain wajib punya:
- `models/`: schema tabel modul.
- `services/`: business logic modul.
- `requests/`: validation schema DTO.
- `forms/`: schema form builder.
- `schema.ts`: entry export tunggal untuk agregasi database schema.

## RBAC Registry Contract
Setiap modul panel wajib terdaftar di RBAC DB:
- `panel_module`:
  - `module_key` unik
  - `title`, `url`, `icon`
  - `sort_order`, `is_visible`, `is_active`
  - `menu_permission_code` (opsional)
- `route_permission`:
  - `route_key` (contoh: `users`)
  - `operation_key` (contoh: `view/create/update/delete`)
  - `permission_code`

## Route Guard Contract
Setiap route panel wajib:
- `load`: pakai guard route operation `view`.
- `actions`: dibungkus guard operation CRUD sesuai action name.
- tidak boleh cek role pakai string hardcode.

## User Role Contract
- User tetap menyimpan `role_id` aktif.
- `role_id` harus valid FK ke tabel role.
- Default role register wajib baca dari `app_setting.default_register_role`.
