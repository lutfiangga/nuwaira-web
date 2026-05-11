import { db } from '$lib/app/database';
import { product } from '../models/product.schema';
import { eq, desc } from 'drizzle-orm';
import { FileHelper } from '$lib/app/helpers/file.helper';
import { withDbFallback } from '$lib/app/server/db';
import type { CreateProductDTO, UpdateProductDTO } from '../requests/product.request';

/**
 * Service untuk menangani logika bisnis terkait Produk.
 */
export class ProductService {

    // Helper: File Upload
    // Note: Kita menggunakan FileHelper sekarang untuk keamanan

    /**
     * Mengambil semua produk beserta data kategorinya.
     * Diurutkan berdasarkan waktu update terakhir (descending).
     */
    static async getAll() {
        return withDbFallback(
            'ProductService.getAll',
            async () => {
                const { category } = await import('$lib/app/modules/category/models/category.schema');

                return await db
                    .select({
                        id: product.id,
                        name: product.name,
                        categoryId: product.categoryId,
                        categoryName: category.name,
                        price: product.price,
                        stock: product.stock,
                        images: product.images,
                        updatedAt: product.updatedAt
                    })
                    .from(product)
                    .leftJoin(category, eq(product.categoryId, category.id))
                    .orderBy(desc(product.updatedAt));
            },
            []
        );
    }

    /**
     * Membuat produk baru.
     * Menangani upload banyak gambar sekaligus menggunakan FileHelper.
     */
    static async create(data: CreateProductDTO) {
        let imagePaths: string[] = [];
        if (data.images && data.images.length > 0) {
            for (const file of data.images) {
                const path = await FileHelper.save(file, data.image_path);
                if (path) imagePaths.push(path);
            }
        }

        await db.insert(product).values({
            id: crypto.randomUUID(),
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
            stock: data.stock,
            images: imagePaths,
            updatedAt: new Date()
        });
    }

    /**
     * Memperbarui data produk.
     * Menangani logika kompleks untuk gambar:
     * 1. Menyimpan gambar yang sudah ada (existing).
     * 2. Menghapus gambar yang ditandai untuk dihapus.
     * 3. Mengupload dan menambahkan gambar baru.
     */
    static async update(data: UpdateProductDTO) {
        const [existing] = await db.select().from(product).where(eq(product.id, data.id)).limit(1);
        if (!existing) throw new Error("Produk tidak ditemukan");

        // Mulai dengan gambar yang sudah ada (dari hidden input)
        let imagePaths: string[] = data.images_existing || [];

        // Hapus gambar yang dibuang (baik file fisik maupun dari list)
        if (data.images_deleted && data.images_deleted.length > 0) {
            for (const deletedPath of data.images_deleted) {
                FileHelper.delete(deletedPath);
            }
        }

        // Upload gambar baru dan tambahkan ke list
        if (data.images && data.images.length > 0) {
            for (const file of data.images) {
                const path = await FileHelper.save(file, data.image_path);
                if (path) imagePaths.push(path);
            }
        }

        await db.update(product)
            .set({
                name: data.name,
                categoryId: data.categoryId,
                price: data.price,
                stock: data.stock,
                images: imagePaths,
                updatedAt: new Date()
            })
            .where(eq(product.id, data.id));
    }

    /**
     * Menghapus produk dan semua gambar yang terkait.
     */
    static async delete(id: string) {
        const [existing] = await db.select().from(product).where(eq(product.id, id)).limit(1);
        if (existing && existing.images && Array.isArray(existing.images)) {
            for (const img of existing.images) {
                FileHelper.delete(img);
            }
        }
        await db.delete(product).where(eq(product.id, id));
    }

    /**
     * Menghapus banyak produk sekaligus.
     */
    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
