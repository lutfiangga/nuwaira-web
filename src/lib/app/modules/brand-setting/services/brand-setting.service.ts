import { eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { brandSetting } from '../models/brand-setting.schema';
import { withDbFallback } from '$lib/app/server/db';
import { FileHelper } from '$lib/app/helpers/file.helper';

export interface BrandSettingData {
	brandName: string | null;
	brandLogo: string | null;
	brandFavicon: string | null;
	brandColor: string | null;
	seoTitle: string | null;
	seoDescription: string | null;
	seoKeywords: string | null;
	seoOgImage: string | null;
	gtagId: string | null;
	cloudinaryFolder: string | null;
}

const DEFAULT_BRAND: BrandSettingData = {
	brandName: 'Nuwaira Academy',
	brandLogo: null,
	brandFavicon: null,
	brandColor: '#092A77',
	seoTitle: null,
	seoDescription: null,
	seoKeywords: null,
	seoOgImage: null,
	gtagId: null,
	cloudinaryFolder: null
};

export class BrandSettingService {
	static async get(): Promise<BrandSettingData> {
		return withDbFallback(
			'BrandSettingService.get',
			async () => {
				const [row] = await db.select().from(brandSetting).where(eq(brandSetting.id, 'default')).limit(1);
				if (!row) return { ...DEFAULT_BRAND };
				return {
					brandName: row.brandName ?? DEFAULT_BRAND.brandName,
					brandLogo: row.brandLogo,
					brandFavicon: row.brandFavicon,
					brandColor: row.brandColor ?? DEFAULT_BRAND.brandColor,
				seoTitle: row.seoTitle,
				seoDescription: row.seoDescription,
				seoKeywords: row.seoKeywords,
				seoOgImage: row.seoOgImage,
				gtagId: row.gtagId,
				cloudinaryFolder: row.cloudinaryFolder
				};
			},
			{ ...DEFAULT_BRAND }
		);
	}

	static async upsert(data: {
		id?: string;
		brandName?: string | null;
		brandLogo?: File | null;
		brandLogoPath?: string;
		brandFavicon?: File | null;
		brandFaviconPath?: string;
		brandColor?: string | null;
		seoTitle?: string | null;
		seoDescription?: string | null;
		seoKeywords?: string | null;
		seoOgImage?: File | null;
		seoOgImagePath?: string;
		gtagId?: string | null;
		cloudinaryFolder?: string | null;
	}) {
		const [existing] = await db.select().from(brandSetting).where(eq(brandSetting.id, 'default')).limit(1);

		let brandLogo = existing?.brandLogo ?? null;
		let brandFavicon = existing?.brandFavicon ?? null;
		let seoOgImage = existing?.seoOgImage ?? null;

		if (data.brandLogo && data.brandLogo.size > 0) {
			if (brandLogo) FileHelper.delete(brandLogo);
			brandLogo = await FileHelper.save(data.brandLogo, data.brandLogoPath ?? 'uploads/brand');
		}

		if (data.brandFavicon && data.brandFavicon.size > 0) {
			if (brandFavicon) FileHelper.delete(brandFavicon);
			brandFavicon = await FileHelper.save(data.brandFavicon, data.brandFaviconPath ?? 'uploads/brand');
		}

		if (data.seoOgImage && data.seoOgImage.size > 0) {
			if (seoOgImage) FileHelper.delete(seoOgImage);
			seoOgImage = await FileHelper.save(data.seoOgImage, data.seoOgImagePath ?? 'uploads/brand');
		}

		const values = {
			brandName: data.brandName?.trim() || existing?.brandName || DEFAULT_BRAND.brandName,
			brandLogo,
			brandFavicon,
			brandColor: data.brandColor?.trim() || existing?.brandColor || DEFAULT_BRAND.brandColor,
			seoTitle: data.seoTitle?.trim() || null,
			seoDescription: data.seoDescription?.trim() || null,
			seoKeywords: data.seoKeywords?.trim() || null,
			seoOgImage,
			gtagId: data.gtagId?.trim() || null,
			cloudinaryFolder: data.cloudinaryFolder?.trim() || null,
			updatedAt: new Date()
		};

		if (existing) {
			await db.update(brandSetting).set(values).where(eq(brandSetting.id, 'default'));
		} else {
			await db.insert(brandSetting).values({ id: 'default', ...values, createdAt: new Date() });
		}
	}
}
