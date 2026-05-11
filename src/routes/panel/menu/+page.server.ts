import { db } from '$lib/app/database';
import { menu } from '$lib/app/modules/menu/models/menu.schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { FileHelper } from '$lib/app/helpers/file.helper';
import { withDbFallback } from '$lib/app/server/db';

export const load = async () => {
    const menus = await withDbFallback(
        'panel/menu load',
        async () => await db.select().from(menu).orderBy(desc(menu.createdAt)),
        []
    );
    return {
        menus
    };
};

export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const images = formData.getAll('images') as File[];
        
        const imagePaths: string[] = [];
        for (const file of images) {
            if (file.size > 0) {
                const path = await FileHelper.save(file, 'uploads/menus');
                imagePaths.push(path);
            }
        }

        const rawData = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            price: Number(formData.get('price')),
            description: formData.get('description') as string,
            images: imagePaths
        };

        try {
            await db.insert(menu).values(rawData);
            return { success: true, message: 'Menu item created successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to create menu item' });
        }
    },
    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        try {
            const [existing] = await db.select().from(menu).where(eq(menu.id, id));
            if (!existing) return fail(404, { message: 'Menu item not found' });

            // Get existing images that should be kept (sent via hidden inputs)
            const existingImagesToKeep = formData.getAll('images_existing') as string[];
            
            // Get deleted images (to remove from disk)
            const deletedImages = formData.getAll('images_deleted') as string[];
            
            // Delete removed images from disk
            deletedImages.forEach(path => {
                if (path) FileHelper.delete(path);
            });

            // Get new uploaded files
            const newImages = formData.getAll('images') as File[];
            const newImagePaths: string[] = [];
            
            for (const file of newImages) {
                if (file && file.size > 0) {
                    const path = await FileHelper.save(file, 'uploads/menus');
                    newImagePaths.push(path);
                }
            }

            // Combine: existing images (that weren't deleted) + new uploads
            const finalImages = [...existingImagesToKeep, ...newImagePaths];

            await db.update(menu).set({
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                price: Number(formData.get('price')),
                description: formData.get('description') as string,
                images: finalImages,
                updatedAt: new Date()
            }).where(eq(menu.id, id));

            return { success: true, message: 'Menu item updated successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to update menu item' });
        }
    },
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        try {
            const [existing] = await db.select().from(menu).where(eq(menu.id, id));
            if (existing) {
                // Delete all images
                existing.images.forEach(path => FileHelper.delete(path));
                await db.delete(menu).where(eq(menu.id, id));
            }
            return { success: true, message: 'Menu item deleted successfully' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to delete menu item' });
        }
    }
};
