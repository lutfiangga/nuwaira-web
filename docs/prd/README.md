# PRD - Nuwaira Academy Student Intake

## Vision

Menyediakan funnel pendaftaran siswa yang jelas, aman untuk data sensitif, dan mudah direview admin sebelum pendaftar menjadi siswa aktif.

## Product Objectives

- Visitor dapat mendaftar melalui form lengkap yang ramah perangkat mobile.
- Domisili menggunakan data wilayah Indonesia yang konsisten.
- NIK tidak pernah disimpan sebagai plaintext.
- Pendaftaran baru masuk sebagai calon siswa berstatus `pending`.
- Admin dapat menerima atau menolak calon siswa.
- Admin dapat mencari, melihat detail, dan mengelola user.
- Student tetap dapat login dan membuka dashboard akun setelah registrasi.

## Primary Users

- Visitor: melihat landing page dan mengisi form pendaftaran.
- Calon siswa: akun student dengan intake `pending`.
- Siswa: pendaftar dengan intake `accepted`.
- Admin: mereview intake dan mengelola user.

## In Scope

- Landing page.
- Form pendaftaran siswa.
- Login dan logout.
- Dashboard shared `/dashboard`.
- Admin `/students`, `/prospective-students`, dan `/users`.
- Approval status `pending`, `accepted`, dan `rejected`.
- Enkripsi dan pencarian aman untuk NIK.
- Integrasi Emsifa, Turnstile, dan Cloudinary.

## Out of Scope

- LMS class/material/enrollment.
- Payment.
- Attendance.
- Certificate.
- Admin review notes.
- Halaman khusus untuk riwayat pendaftar rejected.

## Success Criteria

- Form gagal dengan pesan yang spesifik jika data wajib belum lengkap.
- Hierarki lokasi diverifikasi kembali oleh server.
- Registrasi baru selalu tersimpan sebagai `pending`.
- Pendaftar accepted hanya tampil di `/students`.
- Pendaftar pending hanya tampil di `/prospective-students`.
- NIK dapat didekripsi untuk view berizin tanpa disimpan plaintext.
- Admin dapat menerima atau menolak calon siswa dari daftar maupun detail.

## Related Documents

- [Implementation Status](implementation-status.md)
- [Roadmap](roadmap.md)
