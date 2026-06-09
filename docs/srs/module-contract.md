# Module Contract

## Active Modules

- `user`: akun dan CRUD user.
- `student`: data pendaftaran dan intake status.
- `auth/session`: password, cookie, dan session lifecycle.
- `encryption`: enkripsi/dekripsi dan HMAC index.
- `location`: integrasi Emsifa.
- `turnstile`: verifikasi CAPTCHA.
- `cloudinary`: upload foto user.

## Database Contract

### `user`

Menyimpan akun, role, profil dasar, foto, dan password hash.

### `session`

Menyimpan token session dan waktu kedaluwarsa.

### `students`

Menyimpan relasi user, identitas, NIK terenkripsi, domisili, wali, informasi program, status intake, dan timestamp.

Status enum: `pending | accepted | rejected`.

## Route Contract

Public:

- `/`
- `/register`
- `/login`
- `/logout`
- `/api/locations`

Shared:

- `/dashboard`

Admin:

- `/students`
- `/students/[id]`
- `/prospective-students`
- `/users`

## Service Contract

- `StudentService.getAll`: filter status, search, pagination, dan dekripsi NIK.
- `StudentService.getById`: detail student dengan NIK terdekripsi.
- `StudentService.updateStatus`: conditional transition dari `pending`.
- `UserService`: CRUD user dan foto Cloudinary.
- `LocationService`: fetch provinsi hingga desa dari Emsifa.
- `encryption.ts`: AES-256-GCM dan HMAC SHA-256.

## Migration Contract

```bash
bun run db:generate
bun run db:migrate
```

Database production tidak boleh diubah melalui edit manual yang tidak tercatat sebagai migration.
