# Dynamic LMS Docs Base

Dokumen ini jadi single source of truth untuk implementasi LMS dinamis.

## Structure
- `docs/prd`: product requirement & roadmap.
- `docs/design-system-uml`: model sistem (UML + architecture map).
- `docs/srs`: software requirement detail (functional/non-functional).

## Core Principle
Semua modul wajib config-driven dan policy-driven.
Tidak boleh hardcoded untuk:
- menu panel
- role/permission access
- form fields
- table columns
- CRUD actions
- learning flow states
