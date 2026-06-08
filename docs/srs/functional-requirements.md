# Functional Requirements

## FR-001 Landing Page

- Visitor dapat membuka landing page.
- CTA pendaftaran mengarah ke `/register`.

## FR-002 Register Bootcamp

- Form register terdiri dari dua step.
- Step 1 wajib berisi:
  - nama
  - student type: personal atau business
  - pendidikan
  - motivasi
  - no HP
- Step 2 wajib berisi:
  - email
  - password
  - konfirmasi password
- Foto profil opsional.
- Jika pendidikan `Lainnya`, sistem wajib menampilkan input custom.
- Jika student type `business`, company name wajib diisi.
- Jika student type `personal`, company name tidak wajib dan tidak disimpan.

## FR-003 Register Validation

- Frontend harus menampilkan alert di atas form jika submit/next dilakukan saat data belum lengkap.
- Setiap field harus punya pesan error yang spesifik.
- Error tidak boleh memakai pesan mentah seperti `Invalid input: expected string, received null`.
- Value form tidak boleh hilang ketika user pindah step.

## FR-004 Photo Upload

- Foto register dikompres dan dikonversi ke WebP di browser sebelum submit.
- Server hanya upload foto jika file tersedia.
- Foto user/admin upload harus disimpan di Cloudinary.
- Database menyimpan URL Cloudinary di kolom `user.photo`.
- Local upload directory tidak boleh dipakai untuk flow aktif.

## FR-005 Login

- Login memakai email dan password.
- Username tidak dipakai.
- Admin dan student diarahkan ke `/dashboard`.
- Tampilan dashboard mengikuti role user.

## FR-006 Session Management

- Login baru harus menghapus session lama user yang sama.
- Logout harus menghapus session user dari tabel `session`.
- Session expired harus dibersihkan saat validasi token.

## FR-007 Admin Panel

- Admin dapat membuka dashboard operasional.
- Admin dapat membuka halaman `/users`.
- Admin dapat membuat, mengubah, dan menghapus user dasar.
- Admin panel memakai sidebar.

## FR-008 Student Panel

- Student dapat membuka dashboard profil pendaftaran.
- Student panel memakai sidebar.

## FR-009 Seed

- Seeder hanya membuat admin awal.
- Seed default:
  - email: `admin@nuwaira.id`
  - password: `password`
  - role: `admin`
