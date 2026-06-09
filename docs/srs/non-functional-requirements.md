# Non Functional Requirements

## Maintainability

- Route group harus jelas berdasarkan audience.
- Logika database berada di service/server module.
- Combobox dan date picker harus reusable.
- Docs diperbarui ketika scope, route, schema, atau flow berubah.

## Reliability

- Insert akun dan student harus berada dalam satu transaction.
- Perubahan status harus conditional agar request berulang tidak mengubah hasil review.
- Error external location service harus menghasilkan pesan yang ramah.
- Debounce timer harus dibersihkan ketika komponen dihancurkan.

## Security

- Password menggunakan Argon2.
- NIK menggunakan AES-256-GCM.
- Duplicate check dan exact search NIK menggunakan keyed HMAC.
- Secret database, Cloudinary, Turnstile, dan encryption hanya berasal dari private env.
- Route admin wajib memverifikasi role `admin`.
- Password dan NIK plaintext tidak boleh dicatat pada log.
- `SECRET_KEY` tidak boleh dirotasi tanpa proses re-encryption.

## Privacy

- Export siswa mengandung data sensitif dan hanya tersedia untuk admin.
- Export memproses data halaman aktif yang sudah dimuat.
- Ciphertext NIK tidak boleh diserialisasi ke client.

## Performance

- Tabel admin menggunakan pagination server-side.
- Search otomatis menggunakan debounce 500 ms.
- Search NIK hanya dilakukan untuk input exact 16 digit.
- Data lokasi child dimuat berdasarkan parent.

## Accessibility

- Semua field memiliki label.
- Custom combobox dan calendar dapat difokuskan.
- Checkbox persetujuan terhubung dengan label.
- Status menggunakan teks selain warna.
