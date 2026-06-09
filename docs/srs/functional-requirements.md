# Functional Requirements

## FR-001 Landing Page

- Visitor dapat membuka landing page.
- CTA pendaftaran mengarah ke `/register`.
- Navbar tetap terlihat ketika halaman di-scroll.

## FR-002 Student Registration

- Form wajib mengumpulkan identitas, kontak, domisili, pendidikan, data wali, informasi program, dan kredensial akun.
- NIK harus 16 digit.
- Opsi `Lainnya` wajib membuka input custom.
- Form wajib memiliki tombol kembali.
- User wajib mencentang pernyataan persetujuan.
- Turnstile wajib valid sebelum data disimpan.

## FR-003 Location Selection

- Combobox lokasi harus mendukung pencarian.
- Urutan pilihan: provinsi, kabupaten/kota, kecamatan, kelurahan/desa.
- Pilihan child harus direset ketika parent berubah.
- Server wajib memverifikasi kembali hierarki lokasi melalui Emsifa.

## FR-004 Registration Validation

- NIK dan email harus unik.
- Tanggal lahir tidak boleh berada di masa depan.
- Password minimal delapan karakter dan konfirmasi harus sama.
- Error field harus spesifik dan value non-password dipertahankan setelah gagal.
- Password tidak boleh dikirim kembali pada response form error.

## FR-005 Sensitive NIK

- NIK dienkripsi sebelum insert.
- Exact search NIK menggunakan HMAC index.
- NIK hanya didekripsi di server untuk view berizin.
- Kegagalan `SECRET_KEY` harus menggagalkan registrasi tanpa data parsial.

## FR-006 Intake Status

- Registrasi baru berstatus `pending`.
- `/prospective-students` hanya menampilkan status `pending`.
- `/students` hanya menampilkan status `accepted`.
- Admin dapat menerima calon siswa menjadi `accepted`.
- Admin dapat menolak calon siswa menjadi `rejected`.
- Perubahan status hanya berhasil jika status sebelumnya masih `pending`.
- Status harus tampil pada daftar dan detail.

## FR-007 Student Administration

- Daftar siswa dan calon siswa mendukung search server-side dengan debounce 500 ms.
- Kedua daftar mendukung pagination.
- Kedua daftar mendukung export CSV, Excel, dan PDF untuk halaman aktif.
- Kedua daftar mendukung hide/show columns.
- Kolom aksi harus selalu terlihat.
- Calon siswa menyediakan aksi Terima dan Tolak.

## FR-008 User Administration

- Admin dapat membuat, mengubah, menghapus, dan bulk delete user.
- Daftar user mendukung search debounce, pagination, export, dan hide/show columns.

## FR-009 Authentication

- Login menggunakan email dan password.
- Admin dan student diarahkan ke `/dashboard`.
- Tampilan dashboard mengikuti role akun.
- Login baru menghapus session lama user yang sama.
- Logout menghapus session aktif.

## FR-010 Seed

- Seeder menyediakan admin awal:
  - email: `admin@nuwaira.id`
  - password: `password`
  - role: `admin`
