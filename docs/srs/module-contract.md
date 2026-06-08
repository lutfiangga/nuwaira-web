# Module Contract

## Active Modules

Scope aktif hanya:

- user
- auth/session
- cloudinary upload
- public register/login/logout
- shared dashboard
- admin users

## User Schema Contract

Tabel `user` menyimpan:

- `id`
- `email`
- `role`
- `name`
- `phone`
- `education`
- `motivation`
- `student_type`
- `company_name`
- `photo`
- `password_hash`

## Route Contract

- Public routes:
  - `/`
  - `/register`
  - `/login`
  - `/logout`
- Shared routes:
  - `/dashboard`
- Admin routes:
  - `/users`

## Service Contract

- `auth.ts` menangani password hash, session token, cookie, session cleanup.
- `cloudinary.ts` menangani signed upload ke Cloudinary.
- `UserService` menangani CRUD user dan upload photo user ke Cloudinary.

## Upload Folder Contract

- Register student photo default folder: `bootcamp-students`.
- Admin/user photo folder: `users`.
- Final folder selalu memakai prefix:
  - `${CLOUDINARY_FOLDER_PREFIX}/bootcamp-students`
  - `${CLOUDINARY_FOLDER_PREFIX}/users`
