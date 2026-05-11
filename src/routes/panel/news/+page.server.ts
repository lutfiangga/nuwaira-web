import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { NewsService } from '$lib/app/modules/news/services/news.service';

export const load: PageServerLoad = async () => {
    const newsData = await NewsService.getAll();
    return {
        news: newsData
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();

        const rawData = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            content: formData.get('content') as string,
            thumbnail: formData.get('thumbnail'),
            thumbnail_path: (formData.get('thumbnail_path') as string) || 'uploads/news/thumbnails'
        };

        try {
            await NewsService.create(rawData); 
            return { success: true };
        } catch (e: any) {
             console.error('Create News Error:', e);
             return fail(500, { message: 'Failed to create news' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        const rawData = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            content: formData.get('content') as string,
            thumbnail: formData.get('thumbnail'),
            thumbnail_path: (formData.get('thumbnail_path') as string) || 'uploads/news/thumbnails'
        };

        try {
            await NewsService.update(id, rawData);
            return { success: true };
        } catch (e: any) {
            console.error('Update News Error:', e);
            return fail(500, { message: 'Failed to update news' });
        }
    },

    delete: async ({ request }) => {
         const formData = await request.formData();
         const id = formData.get('id') as string;
         
         try {
             await NewsService.delete(id);
             return { success: true };
         } catch (e) {
             console.error('Delete News Error:', e);
             return fail(500, { message: 'Failed to delete news' });
         }
     },

     bulkDelete: async ({ request }) => {
         const formData = await request.formData();
         const ids = JSON.parse(formData.get('ids') as string) as string[];

         try {
             await NewsService.bulkDelete(ids);
             return { success: true, count: ids.length };
         } catch (e) {
             console.error('Bulk Delete Error:', e);
             return fail(500, { message: 'Failed to delete news articles' });
         }
     }
};
