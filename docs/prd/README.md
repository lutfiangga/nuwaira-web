# PRD - Nuwaira Academy Bootcamp Intake

## Vision

Menyediakan funnel pendaftaran bootcamp yang ringan, jelas, dan siap dipakai untuk calon siswa personal maupun business, dengan panel admin untuk memantau pendaftar.

## Product Objectives

- Calon siswa bisa daftar akun bootcamp dari landing page.
- Siswa langsung masuk ke dashboard setelah register.
- Admin bisa login dan melihat ringkasan intake.
- Admin bisa mengelola user dasar.
- Foto profil disimpan di Cloudinary.
- Runtime development menggunakan Bun.

## Primary Users

- Visitor: melihat landing page dan masuk ke form pendaftaran.
- Student personal: mendaftar untuk kebutuhan individu.
- Student business: mendaftar untuk kebutuhan perusahaan/tim dan wajib mengisi company name.
- Admin: melihat dashboard operasional dan mengelola users.

## In Scope

- Landing page.
- Register bootcamp dua step.
- Login email/password.
- Logout.
- Dashboard shared `/dashboard`.
- Admin users page.
- Cloudinary upload untuk foto.
- Session cleanup.
- Seeder admin.

## Out of Scope

- Role permission CRUD.
- Panel module registry.
- Route permission registry.
- LMS class/material/enrollment workflow.
- Payment.
- Attendance.
- Certificate.

## Success Criteria

- Register tanpa foto tetap berhasil.
- Register dengan foto menyimpan URL Cloudinary.
- Jalur business wajib mengisi company name.
- Pendidikan `Lainnya` menyimpan value custom.
- Admin dan student diarahkan ke `/dashboard` dengan tampilan sesuai role.

## Related Documents

- [Implementation Status](implementation-status.md)
- [Roadmap](roadmap.md)
