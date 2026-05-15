# SRS - Functional Requirements

## Auth & Access
- FR-AUTH-001: Sistem harus mendukung login menggunakan email dan password.
- FR-AUTH-002: Sistem harus mengeluarkan sesi/token yang tervalidasi.
- FR-AUTH-003: Sistem harus menerapkan role-based access control pada route panel.

## User Management
- FR-USER-001: Admin harus dapat membuat, mengubah, menonaktifkan akun pengguna.
- FR-USER-002: Admin harus dapat mengubah role pengguna.

## Course Management
- FR-COURSE-001: Instructor/Admin harus dapat CRUD course.
- FR-COURSE-002: Course harus memiliki status `draft` dan `published`.
- FR-COURSE-003: Instructor/Admin harus dapat CRUD module dan lesson dalam course.
- FR-COURSE-004: Sistem harus mendukung urutan module dan lesson.

## Enrollment & Progress
- FR-ENR-001: Learner harus dapat enroll ke course yang published.
- FR-ENR-002: Sistem harus menyimpan progres per lesson per learner.
- FR-ENR-003: Sistem harus menghitung completion percentage per course.

## Quiz
- FR-QUIZ-001: Instructor/Admin harus dapat CRUD quiz dan question multiple choice.
- FR-QUIZ-002: Sistem harus menyimpan hasil quiz per attempt.
- FR-QUIZ-003: Sistem harus menandai status pass/fail berdasarkan passing score.

## Reporting
- FR-REP-001: Panel harus menampilkan jumlah enrollment per course.
- FR-REP-002: Panel harus menampilkan completion rate per course.
- FR-REP-003: Panel harus menampilkan learner aktif per periode.
