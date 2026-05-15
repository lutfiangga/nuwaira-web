# Functional Requirements

## FR-001 Bootstrap Role
- Sistem harus membuat role awal `superadmin` sebagai bootstrap.
- Role lain tidak wajib ada di seed.

## FR-002 Role Management
- Superadmin harus bisa:
  - create role
  - update role
  - delete role (kecuali bootstrap superadmin)
  - assign permission ke role

## FR-003 Permission Management
- Superadmin harus bisa:
  - create permission code baru
  - update metadata permission
  - delete permission
- Permission code harus unik.

## FR-004 Panel Module Registry
- Superadmin harus bisa kelola daftar menu panel via DB:
  - module key
  - title
  - url
  - icon
  - sort order
  - visibility aktif/nonaktif
  - permission untuk lihat menu

## FR-005 Route Permission Mapping
- Superadmin harus bisa kelola mapping route ke permission via DB:
  - route key
  - operation key (`view/create/update/delete/...`)
  - optional route path/method metadata
  - permission code yang wajib dimiliki
- Semua route panel harus melewati resolver mapping ini.

## FR-006 Authorization Runtime
- Saat request route panel:
  - sistem resolve mapping route+operation -> permission code
  - sistem cek role user punya permission code
  - jika tidak punya, return `403`

## FR-007 Default Register Role
- Superadmin harus bisa set role default untuk user register baru.
- Register flow harus selalu baca nilai setting aktif.

## FR-008 Dynamic Menu Rendering
- Sidebar panel harus mengambil menu dari registry DB.
- Menu tampil hanya jika:
  - module aktif
  - module visible
  - user punya permission menu (kecuali superadmin bypass)

## FR-009 Domain Coverage (Current)
- Modul operasional inti yang aktif:
  - users
  - students
  - classes
  - materials
  - enrollments
