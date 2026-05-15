import { db } from '$lib/app/database';
import { moments } from '$lib/app/modules/moments/models/moments.schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { FileHelper } from '$lib/app/helpers/file.helper';
import { withDbFallback } from '$lib/app/server/db';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load = async (event: import('@sveltejs/kit').RequestEvent) => {
    await requirePermission(event, 'moments', 'read');
    const momentsData = await withDbFallback(
        'panel/moments load',
        async () => await db.select().from(moments).orderBy(desc(moments.date)),
        []
    );
    return {
        moments: momentsData
    };
};

export const actions = guardCrudActions('moments', {
    create: async ({ request }) => {
        const formData = await request.formData();
        const image = formData.get('image') as File;
        
        let imagePath = '';
        if (image && image.size > 0) {
            imagePath = await FileHelper.save(image, 'uploads/moments');
        } else {
            return fail(400, { message: 'Image is required' });
        }

        const rawData = {
            id: crypto.randomUUID(),
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            date: new Date(formData.get('date') as string),
            image: imagePath
        };

        try {
            await db.insert(moments).values(rawData);
            return { success: true, message: 'Moment created successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to create moment' });
        }
    },
    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        try {
            const [existing] = await db.select().from(moments).where(eq(moments.id, id));
            if (!existing) return fail(404, { message: 'Moment not found' });

            const newImage = formData.get('image') as File;
            let imagePath = existing.image;

            if (newImage && newImage.size > 0) {
                // Delete old image
                if (existing.image) FileHelper.delete(existing.image);
                // Save new image
                imagePath = await FileHelper.save(newImage, 'uploads/moments');
            }

            await db.update(moments).set({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                date: new Date(formData.get('date') as string),
                image: imagePath,
                updatedAt: new Date()
            }).where(eq(moments.id, id));

            return { success: true, message: 'Moment updated successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to update moment' });
        }
    },
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        try {
            const [existing] = await db.select().from(moments).where(eq(moments.id, id));
            if (existing) {
                if (existing.image) FileHelper.delete(existing.image);
                await db.delete(moments).where(eq(moments.id, id));
            }
            return { success: true, message: 'Moment deleted successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to delete moment' });
        }
    }
});
