# PRD - Nuwaira Academy

## Vision

Menyediakan platform pendaftaran siswa, manajemen program, dan acara yang terintegrasi — aman untuk data sensitif, mudah direview admin, dan dinamis dari database.

## Product Objectives

- Visitor dapat mendaftar melalui form pendaftaran siswa dan acara yang ramah perangkat mobile.
- Domisili menggunakan data wilayah Indonesia yang konsisten.
- NIK tidak pernah disimpan sebagai plaintext.
- Pendaftaran baru masuk sebagai calon siswa berstatus `pending`.
- Admin dapat menerima atau menolak calon siswa.
- Admin dapat mencari, melihat detail, dan mengelola user.
- Admin dapat mengelola program, acara, konten, dan enrollment dari panel terpusat.
- Homepage dan konten program dinamis dari database.
- Student tetap dapat login dan membuka dashboard akun setelah registrasi.

## Primary Users

- Visitor: melihat landing page, detail program, acara, dan mengisi form pendaftaran.
- Calon siswa: akun student dengan intake `pending`.
- Siswa: pendaftar dengan intake `accepted`.
- Admin: mereview intake, mengelola program, acara, konten, dan user.

## In Scope

- Landing page dinamis dari database.
- Halaman detail program (intro, journey, pricing, FAQ).
- Acara publik dan pendaftaran acara.
- Form pendaftaran siswa.
- Login dan logout.
- Dashboard shared `/dashboard`.
- Admin: students, prospective-students, users, programs, events, content, enrollment.
- Approval status `pending`, `accepted`, dan `rejected`.
- Enkripsi dan pencarian aman untuk NIK.
- Integrasi Emsifa, Turnstile, dan Cloudinary.
- Manajemen konten: social media, FAQ, facilities, registration perks.

## Out of Scope

- LMS class/material/enrollment.
- Payment gateway.
- Attendance tracking.
- Certificate generation.
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
