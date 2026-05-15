import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BrandSettingService } from '$lib/app/modules/brand-setting/services/brand-setting.service';
import { guardPermission, requirePermission } from '$lib/app/middleware';
import { z } from 'zod';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'brand', 'read');
	const brand = await BrandSettingService.get();
	return { brand };
};

const UpdateBrandSchema = z.object({
	brandName: z.string().optional(),
	brandColor: z.string().optional(),
	seoTitle: z.string().optional(),
	seoDescription: z.string().optional(),
	seoKeywords: z.string().optional(),
	brandLogo: z.instanceof(File).optional(),
	brandLogoPath: z.string().optional().default('uploads/brand'),
	brandFavicon: z.instanceof(File).optional(),
	brandFaviconPath: z.string().optional().default('uploads/brand'),
	seoOgImage: z.instanceof(File).optional(),
	seoOgImagePath: z.string().optional().default('uploads/brand'),
	gtagId: z.string().optional(),
	cloudinaryFolder: z.string().optional()
});

export const actions: Actions = {
	updateBrand: guardPermission('brand', 'update', async ({ request }) => {
		const formData = await request.formData();

		const result = UpdateBrandSchema.safeParse({
			brandName: formData.get('brandName'),
			brandColor: formData.get('brandColor'),
			seoTitle: formData.get('seoTitle'),
			seoDescription: formData.get('seoDescription'),
			seoKeywords: formData.get('seoKeywords'),
			brandLogo: formData.get('brandLogo'),
			brandLogoPath: formData.get('brandLogoPath'),
			brandFavicon: formData.get('brandFavicon'),
			brandFaviconPath: formData.get('brandFaviconPath'),
			seoOgImage: formData.get('seoOgImage'),
			seoOgImagePath: formData.get('seoOgImagePath'),
			gtagId: formData.get('gtagId'),
			cloudinaryFolder: formData.get('cloudinaryFolder')
		});

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, { message: 'Validation failed', errors });
		}

		try {
			await BrandSettingService.upsert(result.data);
			return { success: true, message: 'Brand settings updated' };
		} catch (e: any) {
			console.error('Update Brand Error:', e);
			return fail(500, { message: e.message || 'Failed to update brand settings' });
		}
	})
};
