# PRD - LMS Platform

## 1. Product Vision
Membangun Learning Management System (LMS) yang memisahkan pengalaman learner publik dan pengalaman admin panel untuk operasional konten, kelas, dan pengguna.

## 2. Business Goals
- Menyediakan onboarding belajar mandiri dengan alur yang jelas.
- Mempercepat publishing materi oleh admin/instruktur.
- Meningkatkan completion rate dan retensi learner.
- Menyediakan pelaporan progres dan performa belajar.

## 3. Target Users
- Learner: pengguna yang mengikuti course.
- Instructor: pembuat materi dan evaluasi.
- Admin: pengelola user, course, kategori, dan laporan.

## 4. MVP Scope
- Katalog course publik.
- Detail course, syllabus, dan preview lesson.
- Registrasi/login learner.
- Enrollment course.
- Lesson progress tracking.
- Quiz dasar (multiple choice).
- Panel admin untuk CRUD course, module, lesson, quiz, user.
- Dashboard metrik dasar (enrollment, completion, active learners).

## 5. Out of Scope (Phase Berikutnya)
- Live class/video conference bawaan.
- Marketplace multi-vendor.
- Payment gateway kompleks multi-currency.
- Sertifikat dengan verifikasi blockchain.

## 6. Success Metrics
- Completion rate per course.
- Weekly active learners.
- Average learning time per user.
- Course publish lead time (draft -> published).
- Quiz pass rate.

## 7. Milestone Tingkat Tinggi
- Milestone 1: Fondasi arsitektur route `(public)` dan `(panel)`.
- Milestone 2: Modul autentikasi + role.
- Milestone 3: Modul course & content management.
- Milestone 4: Modul enrollment, progress, dan quiz.
- Milestone 5: Reporting + hardening production.
