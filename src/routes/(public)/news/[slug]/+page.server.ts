import type { PageServerLoad } from './$types';
import { NewsService } from '$lib/app/modules/news/services/news.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const article = await NewsService.getBySlug(params.slug);
    
    if (!article) {
        throw error(404, 'Article not found');
    }
    
    return {
        article
    };
};
