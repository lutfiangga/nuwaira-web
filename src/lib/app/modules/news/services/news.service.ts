
import { db } from '$lib/app/database';
import { news, type NewNews, type News } from '../models/news.schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { FileHelper } from '$lib/app/helpers/file.helper';
import { withDbFallback, withDbNullable } from '$lib/app/server/db';

export class NewsService {
    static async getAll() {
        return withDbFallback(
            'NewsService.getAll',
            async () => await db.select().from(news).orderBy(desc(news.createdAt)),
            []
        );
    }

    static async getById(id: string) {
        return withDbNullable('NewsService.getById', async () => {
            const [result] = await db.select().from(news).where(eq(news.id, id));
            return result ?? null;
        });
    }

    static async getBySlug(slug: string) {
        return withDbNullable('NewsService.getBySlug', async () => {
            const [result] = await db.select().from(news).where(eq(news.slug, slug));
            return result ?? null;
        });
    }

    /**
     * Extract all image URLs from HTML content
     */
    private static extractImageUrls(htmlContent: string): string[] {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const urls: string[] = [];
        let match;
        
        while ((match = imgRegex.exec(htmlContent)) !== null) {
            urls.push(match[1]);
        }
        
        return urls;
    }

    /**
     * Delete files that are no longer referenced in content
     */
    private static deleteUnusedImages(oldContent: string, newContent: string) {
        const oldImages = this.extractImageUrls(oldContent);
        const newImages = this.extractImageUrls(newContent);
        
        // Find images that were removed
        const deletedImages = oldImages.filter(url => !newImages.includes(url));
        
        // Delete each removed image
        deletedImages.forEach(url => {
            FileHelper.delete(url);
        });
    }

    static async create(data: any) {
        // Handle thumbnail file upload if provided
        if (data.thumbnail instanceof File && data.thumbnail.size > 0) {
            const thumbnailPath = await FileHelper.save(data.thumbnail, data.thumbnail_path || 'uploads/news/thumbnails');
            data.thumbnail = thumbnailPath;
        } else {
            // If no file or empty file, remove thumbnail field
            delete data.thumbnail;
        }
        
        // Remove helper fields
        delete data.thumbnail_path;
        
        const [result] = await db.insert(news).values(data).returning();
        return result;
    }

    static async update(id: string, data: any) {
        // Get existing article to compare images
        const existing = await this.getById(id);
        if (!existing) return null;

        // Handle thumbnail file upload if provided
        if (data.thumbnail instanceof File && data.thumbnail.size > 0) {
            // Delete old thumbnail if exists
            if (existing.thumbnail) {
                FileHelper.delete(existing.thumbnail);
            }
            const thumbnailPath = await FileHelper.save(data.thumbnail, data.thumbnail_path || 'uploads/news/thumbnails');
            data.thumbnail = thumbnailPath;
        } else {
            // Keep existing thumbnail if no new file uploaded
            delete data.thumbnail;
        }
        
        // Check for deleted images in content
        if (data.content && existing.content) {
            this.deleteUnusedImages(existing.content, data.content);
        }
        
        // Remove helper fields
        delete data.thumbnail_path;

        const [result] = await db
            .update(news)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(news.id, id))
            .returning();
        return result;
    }

    static async delete(id: string) {
        // Get article to delete associated files
        const article = await this.getById(id);
        if (article) {
            // Delete thumbnail
            if (article.thumbnail) {
                FileHelper.delete(article.thumbnail);
            }
            
            // Delete all images in content
            const contentImages = this.extractImageUrls(article.content);
            contentImages.forEach(url => FileHelper.delete(url));
        }
        
        await db.delete(news).where(eq(news.id, id));
    }

    static async bulkDelete(ids: string[]) {
        // Get all articles to delete files
        const articles = await db.select().from(news).where(inArray(news.id, ids));
        
        // Delete all associated files
        articles.forEach(article => {
            if (article.thumbnail) {
                FileHelper.delete(article.thumbnail);
            }
            
            const contentImages = this.extractImageUrls(article.content);
            contentImages.forEach(url => FileHelper.delete(url));
        });
        
        await db.delete(news).where(inArray(news.id, ids));
    }
}
