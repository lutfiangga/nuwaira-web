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

## FR-011 Program Management

- Admin dapat membuat, mengubah, dan menghapus program.
- Program memiliki slug, title, summary, hero image, dan status (draft/published/archived).
- Admin dapat mengelola intro program (eyebrow, title, deskripsi, learning background, gambar).
- Admin dapat mengelola offerings (batch/private) dengan harga, benefits, dan schedule.
- Admin dapat mengelola batch dengan kapasitas, tanggal, lokasi (onsite/remote), dan status buka/tutup.
- Admin dapat mengelola milestones, metrics, journeys, paragraphs, checklists, dan FAQ per program.
- Homepage program section menampilkan program yang published dan memiliki offering aktif.

## FR-012 Event Management

- Admin dapat membuat, mengubah, dan menghapus acara.
- Acara memiliki slug, title, deskripsi, tipe acara, tanggal, waktu, lokasi, harga, dan gambar.
- Halaman publik `/acara` menampilkan daftar acara aktif.
- Halaman detail `/acara/[slug]` menampilkan informasi acara lengkap.
- Pengunjung dapat mendaftar acara melalui `/acara/[slug]/register`.
- Duplicate check: email yang sama tidak boleh mendaftar acara yang sama dua kali.
- Halaman pendaftaran acara memiliki layout bersih tanpa navbar/footer.
- Turnstile wajib valid sebelum pendaftaran acara disimpan.

## FR-013 Content Management

- Admin dapat mengelola social media dengan icon selection dan bulk save.
- Validasi social media menampilkan error per-field (platform, URL, icon).
- Admin dapat mengelola FAQ.
- Admin dapat mengelola facilities dengan gambar.
- Admin dapat mengelola registration perks.

## FR-014 Enrollment

- Enrollment mencatat pendaftaran siswa ke offering/batch.
- Admin dapat melihat daftar enrollment.
