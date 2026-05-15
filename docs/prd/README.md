# PRD - Dynamic LMS Platform

## Vision
Membangun LMS siap pakai dengan governance penuh dari panel admin: role, permission, menu, route access, dan CRUD module dikontrol data (DB), bukan hardcode.

## Product Objectives
- Menyediakan fondasi LMS multi-role yang bisa diubah tanpa redeploy.
- Menjadikan superadmin sebagai bootstrap governance owner.
- Memastikan onboarding modul baru cukup lewat registry + schema contract.
- Menurunkan biaya maintenance lewat arsitektur config-driven.

## Primary Users
- Superadmin: mendefinisikan role, permission, route access, menu, default register role.
- Operator (role custom): mengelola data operasional LMS sesuai permission.
- Instructor (role custom): mengelola materi/kelas jika diberi akses.
- Learner/student: tidak wajib ada sebagai role tetap, tergantung konfigurasi superadmin.

## In Scope (Current Release)
- Dynamic RBAC registry:
  - Role CRUD.
  - Permission CRUD.
  - Role-permission assignment.
  - Panel module/menu registry CRUD.
  - Route-permission mapping CRUD.
  - Default register role setting.
- LMS Core CRUD modules:
  - Users
  - Students
  - Classes
  - Materials
  - Enrollments
- Route group architecture:
  - `src/routes/(public)`
  - `src/routes/(panel)`

## Out of Scope (Current Release)
- Payment gateway production integration.
- Assessment engine kompleks (adaptive test).
- Multi-tenant isolasi data lintas organisasi.

## Product Rules
- Tidak boleh ada daftar role tetap di code.
- Tidak boleh ada daftar menu panel tetap di code.
- Tidak boleh ada permission matrix tetap di code.
- Route access harus resolve ke permission via tabel mapping.

## Success Criteria
- Superadmin bisa menambah role baru dan langsung pakai tanpa ubah code.
- Superadmin bisa mematikan menu modul via panel dan langsung berdampak ke sidebar.
- Superadmin bisa memetakan route ke permission dari panel.
- Register user baru mengikuti default role dari setting aktif.
