import { db } from '$lib/app/database';
import { user } from '../models/user.schema';
import { eq, ilike, asc, desc, or, sql } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/app/server/auth';
import { withDbFallback, withDbNullable } from '$lib/app/server/db';
import type { CreateUserDTO, UpdateUserDTO } from '../requests/user.request';
import type { UpdateProfileDTO, ChangePasswordDTO } from '../requests/profile.request';
import { uploadCloudinaryImage, deleteCloudinaryImage } from '$lib/app/server/cloudinary';

const USER_PHOTO_FOLDER = 'users';

/**
 * Service untuk menangani logika bisnis terkait Pengguna (User).
 */
export class UserService {
	/**
	 * Mengambil daftar pengguna dengan dukungan pencarian, paginasi, dan pengurutan.
	 * @param params Parameter query (search, page, pageSize, sort, order)
	 */
	static async getAll(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		sort?: string;
		order?: string;
	}) {
		const { search, page = 1, pageSize = 10, sort = 'email', order = 'asc' } = params;
		return withDbFallback(
			'UserService.getAll',
			async () => {
				const offset = (page - 1) * pageSize;

				// Clause Where
				const whereClause = search
					? or(ilike(user.email, `%${search}%`), ilike(user.name, `%${search}%`))
					: undefined;

				// Mapping Kolom Sortir
				const sortMap: Record<string, any> = {
					email: user.email,
					name: user.name,
					role: user.role,
					id: user.id
				};
				const sortCol = sortMap[sort] || user.email;
				const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

				const [users, totalResult] = await Promise.all([
					db.select().from(user).where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
					db
						.select({ count: sql<number>`count(*)` })
						.from(user)
						.where(whereClause)
				]);

				return {
					users,
					total: Number(totalResult[0]?.count ?? 0)
				};
			},
			{ users: [], total: 0 }
		);
	}

	/**
	 * Mengambil satu pengguna berdasarkan ID.
	 */
	static async getById(id: string) {
		return withDbNullable('UserService.getById', async () => {
			const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);
			return result ?? null;
		});
	}

	/**
	 * Membuat pengguna baru.
	 * Menangani upload foto ke Cloudinary.
	 */
	static async create(data: CreateUserDTO) {
		const passwordHash = await hashPassword(data.password);
		const role = data.role || 'student';

		let photoUrl = null;
		if (data.photo && data.photo.size > 0) {
			const photo = await uploadCloudinaryImage(data.photo, USER_PHOTO_FOLDER);
			photoUrl = photo.url;
		}

		await db.insert(user).values({
			id: crypto.randomUUID(),
			email: data.email,
			role,
			passwordHash: passwordHash,
			photo: photoUrl
		});
	}

	/**
	 * Memperbarui data pengguna.
	 * Jika ada foto baru, foto akan diunggah ke Cloudinary dan URL-nya disimpan.
	 */
	static async update(data: UpdateUserDTO) {
		const [existing] = await db.select().from(user).where(eq(user.id, data.id)).limit(1);
		if (!existing) throw new Error('Pengguna tidak ditemukan');

		const updateData: Record<string, any> = {
			email: data.email,
			role: data.role || existing.role
		};

		if (data.password) {
			updateData.passwordHash = await hashPassword(data.password);
		}

		// Handle upload foto baru -> hapus foto lama
		if (data.photo && data.photo.size > 0 && data.photo.name !== 'undefined') {
			if (existing.photo) {
				await deleteCloudinaryImage(existing.photo).catch(() => {});
			}
			const photo = await uploadCloudinaryImage(data.photo, USER_PHOTO_FOLDER);
			updateData.photo = photo.url;
		} else if (data.photoDeleted && existing.photo) {
			await deleteCloudinaryImage(existing.photo).catch(() => {});
			updateData.photo = null;
		}

		await db.update(user).set(updateData).where(eq(user.id, data.id));
	}

	/**
	 * Memperbarui profil pengguna (untuk user yang sedang login).
	 */
	static async updateProfile(userId: string, data: UpdateProfileDTO) {
		const [existing] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
		if (!existing) throw new Error('Pengguna tidak ditemukan');

		const updateData: Record<string, any> = {};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.email !== undefined) updateData.email = data.email;

		// Handle upload foto baru -> hapus foto lama
		if (data.photo && data.photo.size > 0 && data.photo.name !== 'undefined') {
			if (existing.photo) {
				await deleteCloudinaryImage(existing.photo).catch(() => {});
			}
			const photo = await uploadCloudinaryImage(data.photo, USER_PHOTO_FOLDER);
			updateData.photo = photo.url;
		} else if (data.photoDeleted && existing.photo) {
			await deleteCloudinaryImage(existing.photo).catch(() => {});
			updateData.photo = null;
		}

		await db.update(user).set(updateData).where(eq(user.id, userId));
	}

	/**
	 * Mengubah kata sandi pengguna.
	 * Memerlukan verifikasi kata sandi lama terlebih dahulu.
	 */
	static async changePassword(userId: string, data: ChangePasswordDTO) {
		const [existing] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
		if (!existing) throw new Error('Pengguna tidak ditemukan');

		// Verifikasi password saat ini
		const isValid = await verifyPassword(existing.passwordHash, data.currentPassword);
		if (!isValid) throw new Error('Password saat ini salah');

		// Update password
		const newPasswordHash = await hashPassword(data.newPassword);
		await db.update(user).set({ passwordHash: newPasswordHash }).where(eq(user.id, userId));
	}

	/**
	 * Menghapus pengguna.
	 */
	static async delete(id: string) {
		const [existing] = await db.select().from(user).where(eq(user.id, id)).limit(1);
		if (existing?.photo) {
			await deleteCloudinaryImage(existing.photo).catch(() => {});
		}
		await db.delete(user).where(eq(user.id, id));
	}

	/**
	 * Menghapus banyak pengguna sekaligus.
	 */
	static async bulkDelete(ids: string[]) {
		for (const id of ids) {
			await this.delete(id);
		}
	}
}
