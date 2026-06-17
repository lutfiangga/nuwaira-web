# Module Contract

## Active Modules

- `user`: akun dan CRUD user.
- `student`: data pendaftaran dan intake status.
- `auth/session`: password, cookie, dan session lifecycle.
- `encryption`: enkripsi/dekripsi dan HMAC index.
- `location`: integrasi Emsifa.
- `turnstile`: verifikasi CAPTCHA.
- `cloudinary`: upload gambar (user, program, acara, facilities).
- `program`: CRUD program, intro, offerings, batches, konten program.
- `event`: CRUD acara dan pendaftaran acara.
- `content`: social media, FAQ, facilities, registration perks.
- `enrollment`: enrollment siswa ke offering/batch.

## Database Contract

### `user`

Menyimpan akun, role, profil dasar, foto, dan password hash.

### `session`

Menyimpan token session dan waktu kedaluwarsa.

### `students`

Menyimpan relasi user, identitas, NIK terenkripsi, domisili, wali, informasi program, status intake, dan timestamp.

Status enum: `pending | accepted | rejected`.

### `programs`

Menyimpan program dengan slug, title, summary, eyebrow, hero image, status, dan isActive.

### `program_intros`

Menyimpan intro per program: eyebrow, title, deskripsi (array), learning background (array), gambar, dan alt.

### `program_offerings`

Menyimpan offering per program: tipe (batch/private), nama, harga, benefits, schedule.

### `program_batches`

Menyimpan batch per offering: kapasitas, tanggal mulai/selesai, registrasi buka/tutup, lokasi (onsite/remote), isOpen.

### `program_milestones`, `program_metrics`, `program_journeys`, `program_paragraphs`, `program_checklists`

Konten program dengan position ordering.

### `program_faqs`

FAQ per program dengan position dan isActive.

### `public_events`

Acara publik: slug, title, deskripsi, tipe acara, tanggal, waktu, lokasi, harga, gambar, URL registrasi.

### `event_registrations`

Pendaftaran acara: nama, email, telepon, domisili, tipe peserta, referral, status.

### `enrollments`

Enrollment siswa ke offering/batch dengan status.

### `facilities`, `social_links`, `registration_perks`

Konten dinamis dengan position ordering dan isActive.

## Route Contract

Public:

- `/` — landing page.
- `/register` — pendaftaran siswa.
- `/login` — login.
- `/logout` — logout.
- `/programs/[slug]` — detail program.
- `/acara` — daftar acara.
- `/acara/[slug]` — detail acara.
- `/acara/[slug]/register` — pendaftaran acara.
- `/api/locations` — proxy Emsifa.
- `/api/upload` — upload gambar Cloudinary.

Shared:

- `/dashboard` — dashboard role-aware.
- `/attendance` — absensi.

Admin:

- `/students`, `/students/[id]`
- `/prospective-students`
- `/users`
- `/programs`, `/programs/detail/[id]`
- `/events`, `/events/detail/[id]`
- `/enrollments`
- `/faqs`, `/social-media`
- `/intros`, `/metrics`, `/milestones`, `/offerings`, `/batches`, `/checklists`

## Service Contract

- `StudentService.getAll`: filter status, search, pagination, dan dekripsi NIK.
- `StudentService.getById`: detail student dengan NIK terdekripsi.
- `StudentService.updateStatus`: conditional transition dari `pending`.
- `UserService`: CRUD user dan foto Cloudinary.
- `ProgramService`: CRUD program, intro, offerings, batches, konten, navigasi publik.
- `EventService`: CRUD acara dan pendaftaran.
- `LocationService`: fetch provinsi hingga desa dari Emsifa.
- `encryption.ts`: AES-256-GCM dan HMAC SHA-256.

## Migration Contract

```bash
bun run db:generate
bun run db:migrate
```