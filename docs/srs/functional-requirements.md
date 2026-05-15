# SRS - Functional Requirements (Dynamic First)

## FR-DYN-001 Module Registry
Sistem harus punya module registry terpusat untuk mendefinisikan resource, route, permission, dan metadata UI.

## FR-DYN-002 Dynamic Menu
Sistem harus generate menu panel berdasarkan permission map user.

## FR-DYN-003 Dynamic CRUD Policy
Setiap action `create/read/update/delete` wajib melalui guard policy.

## FR-DYN-004 Dynamic Form Renderer
Setiap form CRUD wajib dibangun dari schema config, bukan hardcoded component tree.

## FR-DYN-005 Dynamic Table Renderer
Setiap table/list wajib dibangun dari column schema config.

## FR-DYN-006 Role Governance
Superadmin wajib bisa:
- set default register role
- atur permission matrix per role

## FR-DYN-007 Extensible Module Contract
Modul baru harus bisa ditambahkan tanpa modifikasi core layout dan core auth flow.
