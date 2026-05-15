# Implementation Status

## Completed Baseline
- Route grouping `src/routes/(public)` dan `src/routes/(panel)`.
- Core LMS module cleanup:
  - users
  - students
  - classes
  - materials
  - enrollments
- Legacy non-LMS modules removed.
- Schema export per modul aktif.

## In Progress (Critical Refactor)
- Dynamic RBAC total rewrite:
  - remove hardcoded role list
  - remove hardcoded menu list
  - remove hardcoded permission matrix
  - add route-permission registry
  - add panel-module registry
- RBAC panel expansion:
  - role CRUD
  - permission CRUD
  - module registry CRUD
  - route mapping CRUD

## Next After RBAC Stabilized
- Public catalog module.
- Learner dashboard module.
- Session/attendance module.
