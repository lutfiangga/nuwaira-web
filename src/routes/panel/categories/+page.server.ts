import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { CategoryService } from '$lib/app/modules/category/services/category.service';
import { CreateCategorySchema, UpdateCategorySchema } from '$lib/app/modules/category/requests/category.request';

export const load: PageServerLoad = async () => {
    // Memuat daftar semua kategori
    const categories = await CategoryService.getAll();
    return { categories };
};

export const actions: Actions = {
    /**
     * Menangani pembuatan kategori baru.
     * Menerima input: name, description.
     */
    create: async ({ request }) => {
        const formData = await request.formData();

        const rawData = {
            name: formData.get('name'),
            description: formData.get('description')
        };

        const result = CreateCategorySchema.safeParse(rawData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validasi gagal', errors });
        }

        try {
            await CategoryService.create(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Create Category Error:', e);
            return fail(500, { message: 'Gagal membuat kategori' });
        }
    },

    /**
     * Menangani pembaruan data kategori.
     */
    update: async ({ request }) => {
        const formData = await request.formData();

        const rawData = {
            id: formData.get('id'),
            name: formData.get('name'),
            description: formData.get('description')
        };

        const result = UpdateCategorySchema.safeParse(rawData);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validasi gagal', errors });
        }

        try {
            await CategoryService.update(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Update Category Error:', e);
            return fail(500, { message: 'Gagal memperbarui kategori' });
        }
    },

    /**
     * Menangani penghapusan kategori tunggal.
     */
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        try {
            await CategoryService.delete(id);
            return { success: true };
        } catch (e) {
            console.error('Delete Category Error:', e);
            return fail(500, { message: 'Failed to delete category' });
        }
    },

    bulkDelete: async ({ request }) => {
        const formData = await request.formData();
        const ids = JSON.parse(formData.get('ids') as string) as string[];

        try {
            await CategoryService.bulkDelete(ids);
            return { success: true, count: ids.length };
        } catch (e) {
            console.error('Bulk Delete Error:', e);
            return fail(500, { message: 'Failed to delete categories' });
        }
    }
};
