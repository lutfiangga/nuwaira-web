# Dynamic LMS Documentation

Dokumen ini adalah source of truth untuk platform LMS dinamis.

## Folder
- `docs/prd`: arah produk, scope delivery, roadmap modul dinamis.
- `docs/srs`: kebutuhan fungsional/non-fungsional + kontrak teknis per modul.
- `docs/design-system-uml`: model sistem (use case, class, sequence, activity).

## Principle
- Role tidak hardcoded di codebase.
- Permission tidak hardcoded di codebase.
- Akses menu panel tidak hardcoded di codebase.
- Route ke permission harus melalui registry DB.
- Superadmin hanya bootstrap role awal, role lain dibuat dari panel RBAC.

## Governance
- Perubahan fitur wajib update dokumen ini dulu.
- Implementasi harus mengikuti `docs/srs/module-contract.md`.
- SQL migration dan `schema.ts` per modul wajib sinkron.
