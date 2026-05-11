import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProductService } from '$lib/app/modules/product/services/product.service';
import { CategoryService } from '$lib/app/modules/category/services/category.service';
import { CreateProductSchema, UpdateProductSchema } from '$lib/app/modules/product/requests/product.request';


export const load: PageServerLoad = async () => {
    const [products, categories] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll()
    ]);
    return { products, categories };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();

        // Construct raw object for validation
        const allImages = formData.getAll('images');
        const validImages = allImages.filter((f): f is File => f instanceof File && f.size > 0);

        const rawData = {
            name: formData.get('name'),
            categoryId: formData.get('categoryId'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            images: validImages.length > 0 ? validImages : undefined,
            image_path: (formData.get('images_path') as string) || 'uploads/products'
        };

        console.log('Raw data:', {
            ...rawData,
            images: rawData.images?.map((f: any) => ({ name: f.name, size: f.size, type: f.type })) || []
        });

        const result = CreateProductSchema.safeParse(rawData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            console.error('Validation errors:', errors);
            // We return formatting error logic, simplest is joining or just passing raw
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await ProductService.create(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Create Product Error:', e);
            return fail(500, { message: 'Failed to create product' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();

        const allImages = formData.getAll('images');
        const validImages = allImages.filter((f): f is File => f instanceof File && f.size > 0);

        // Get existing images to keep
        const existingImages = formData.getAll('images_existing').filter((v): v is string => typeof v === 'string');

        // Get deleted images
        const deletedImages = formData.getAll('images_deleted').filter((v): v is string => typeof v === 'string');

        const rawData = {
            id: formData.get('id'),
            name: formData.get('name'),
            categoryId: formData.get('categoryId'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            images: validImages.length > 0 ? validImages : undefined,
            images_existing: existingImages.length > 0 ? existingImages : undefined,
            images_deleted: deletedImages.length > 0 ? deletedImages : undefined,
            image_path: (formData.get('images_path') as string) || 'uploads/products'
        };

        console.log('Update rawData:', {
            ...rawData,
            images: rawData.images?.map((f: any) => f.name) || [],
            images_existing: rawData.images_existing || [],
            images_deleted: rawData.images_deleted || []
        });

        const result = UpdateProductSchema.safeParse(rawData);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            console.error('Update Validation errors:', errors);
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await ProductService.update(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Update Product Error:', e);
            return fail(500, { message: 'Failed to update product' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        try {
            await ProductService.delete(id);
            return { success: true };
        } catch (e) {
            console.error('Delete Product Error:', e);
            return fail(500, { message: 'Failed to delete product' });
        }
    },

    bulkDelete: async ({ request }) => {
        const formData = await request.formData();
        const ids = JSON.parse(formData.get('ids') as string) as string[];

        try {
            await ProductService.bulkDelete(ids);
            return { success: true, count: ids.length };
        } catch (e) {
            console.error('Bulk Delete Error:', e);
            return fail(500, { message: 'Failed to delete products' });
        }
    }
};
