import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProductService } from '$lib/app/modules/product/services/product.service';
import { CategoryService } from '$lib/app/modules/category/services/category.service';
import { CreateProductSchema, UpdateProductSchema } from '$lib/app/modules/product/requests/product.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'products', 'read');

	const [products, categories] = await Promise.all([ProductService.getAll(), CategoryService.getAll()]);
	return { products, categories };
};

const actionHandlers = guardCrudActions('products', {
	create: async ({ request }) => {
		const formData = await request.formData();
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

		const result = CreateProductSchema.safeParse(rawData);
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
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
		const existingImages = formData
			.getAll('images_existing')
			.filter((value): value is string => typeof value === 'string');
		const deletedImages = formData
			.getAll('images_deleted')
			.filter((value): value is string => typeof value === 'string');

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

		const result = UpdateProductSchema.safeParse(rawData);
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
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
});

export const actions: Actions = actionHandlers as Actions;
