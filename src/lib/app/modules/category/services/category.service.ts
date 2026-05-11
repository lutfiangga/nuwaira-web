import { db } from '$lib/app/database';
import { category } from '../models/category.schema';
import { eq, desc } from 'drizzle-orm';
import { withDbFallback } from '$lib/app/server/db';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../requests/category.request';

export class CategoryService {

    /**
     * Mengambil daftar semua kategori.
     * Diurutkan berdasarkan waktu pembuatan terbaru.
     */
    static async getAll() {
        return withDbFallback(
            'CategoryService.getAll',
            async () => await db.select().from(category).orderBy(desc(category.createdAt)),
            []
        );
    }

    /**
     * Membuat kategori baru.
     */
    static async create(data: CreateCategoryDTO) {
        await db.insert(category).values({
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    /**
     * Memperbarui data kategori.
     */
    static async update(data: UpdateCategoryDTO) {
        await db.update(category)
            .set({
                name: data.name,
                description: data.description,
                updatedAt: new Date()
            })
            .where(eq(category.id, data.id));
    }

    /**
     * Menghapus kategori berdasarkan ID.
     */
    static async delete(id: string) {
        await db.delete(category).where(eq(category.id, id));
    }

    /**
     * Menghapus banyak kategori sekaligus berdasarkan array ID.
     */
    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
