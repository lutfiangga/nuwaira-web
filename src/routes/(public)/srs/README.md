# SRS - LMS Platform

## 1. Purpose
Dokumen ini mendefinisikan kebutuhan perangkat lunak LMS untuk implementasi MVP yang scalable dan maintainable.

## 2. System Context
- Frontend public untuk learner.
- Frontend panel untuk admin/instruktur.
- Backend service untuk auth, course, enrollment, progress, quiz, reporting.
- Database relasional untuk data inti.
- Storage untuk aset konten (image/file/video metadata).

## 3. Primary Modules
- Authentication & Authorization
- User & Role Management
- Course Catalog & Content Management
- Enrollment & Learning Progress
- Quiz & Assessment
- Reporting Dashboard
- File/Asset Management

## 4. Assumptions
- Role minimal: `admin`, `instructor`, `learner`.
- Multi-tenant belum masuk MVP.
- Integrasi payment opsional sesuai fase deployment.

## 5. Constraints
- Semua endpoint protected by role policy.
- Audit trail untuk perubahan konten penting.
- Arsitektur modular agar mudah ekspansi fitur.
