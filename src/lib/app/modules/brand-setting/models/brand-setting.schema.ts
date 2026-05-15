import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const brandSetting = pgTable('brand_setting', {
	id: text('id').primaryKey().default('default'),
	brandName: text('brand_name'),
	brandLogo: text('brand_logo'),
	brandFavicon: text('brand_favicon'),
	brandColor: text('brand_color'),
	seoTitle: text('seo_title'),
	seoDescription: text('seo_description'),
	seoKeywords: text('seo_keywords'),
	seoOgImage: text('seo_og_image'),
	gtagId: text('gtag_id'),
	cloudinaryFolder: text('cloudinary_folder'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export type BrandSetting = typeof brandSetting.$inferSelect;
