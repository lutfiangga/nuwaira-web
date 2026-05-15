# PRD - Dynamic LMS

## Product Goal
Membangun LMS enterprise yang seluruh alur operasional berjalan dinamis dari konfigurasi dan metadata, bukan hardcoded per halaman.

## Scope MVP
- Multi-role platform: superadmin, admin, instructor, learner.
- Dynamic RBAC untuk menu + CRUD action.
- Dynamic course builder: course -> module -> lesson -> assessment.
- Dynamic enrollment pipeline.
- Dynamic dashboard berdasarkan metric config.

## Dynamic Principle
- Menu panel disusun dari registry permission.
- Form CRUD disusun dari field schema.
- Table/list disusun dari column schema.
- Validasi disusun dari request schema.
- Workflow state disusun dari state map.

## Success Metrics
- Waktu tambah modul baru < 1 hari tanpa copy-paste route logic.
- 0 hardcoded permission check di UI layer.
- 100% CRUD module lewat reusable engine.
