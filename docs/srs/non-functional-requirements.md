# Non Functional Requirements

## Maintainability

- Runtime command harus konsisten memakai Bun.
- Route group harus jelas berdasarkan audience:
  - public
  - shared
  - admin
- Dashboard shared tidak boleh diduplikasi untuk admin dan student.
- Docs harus diperbarui ketika scope berubah.

## Reliability

- Register dan login harus tetap menampilkan pesan validasi ramah saat input kosong/null.
- Session cleanup harus mencegah tabel `session` membengkak.
- Upload foto opsional tidak boleh menggagalkan register.

## Security

- Password wajib di-hash dengan Argon2.
- Cloudinary API secret hanya dibaca dari env private.
- Admin route wajib mengecek `role === 'admin'`.
- Student dashboard wajib butuh login.
- Cookie session harus memakai path `/`.

## Storage

- Foto tidak boleh disimpan ke local server pada flow aktif.
- Database hanya menyimpan URL foto.
- Folder Cloudinary harus memakai prefix per environment.

## Performance

- Dashboard admin hanya mengambil ringkasan dan daftar siswa terbatas.
- Tabel users memakai pagination.

## Accessibility

- Form field harus punya label.
- Password field harus punya toggle show/hide dengan label aksesibel.
- Alert validasi harus muncul dekat bagian atas form.
