import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { OutletService } from '$lib/app/modules/outlet/services/outlet.service';
import { CreateOutletSchema, UpdateOutletSchema } from '$lib/app/modules/outlet/requests/outlet.request';

// Helper function to normalize coordinates (handle both comma and dot as decimal separator)
function normalizeCoordinate(value: string | null | undefined): number | null {
    if (!value) return null;

    const stringValue = String(value).trim();
    if (!stringValue) return null;

    // Replace comma with dot for decimal separator
    const normalized = stringValue.replace(',', '.');
    const parsed = Number(normalized);

    return isNaN(parsed) ? null : parsed;
}

export const load: PageServerLoad = async () => {
    const outlets = await OutletService.getAll();

    // Add combined location field
    const outletsWithLocation = outlets.map(outlet => ({
        ...outlet,
        location: [outlet.district, outlet.city, outlet.province]
            .filter(Boolean)
            .join(', ') || '-'
    }));

    return { outlets: outletsWithLocation };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();

        const rawData = {
            name: formData.get('name'),
            address: formData.get('address'),
            province: formData.get('province'),
            city: formData.get('city'),
            district: formData.get('district'),
            latitude: normalizeCoordinate(formData.get('latitude') as string),
            longitude: normalizeCoordinate(formData.get('longitude') as string)
        };

        const result = CreateOutletSchema.safeParse(rawData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await OutletService.create(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Create Outlet Error:', e);
            return fail(500, { message: 'Failed to create outlet' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();

        const rawData = {
            id: formData.get('id'),
            name: formData.get('name'),
            address: formData.get('address'),
            province: formData.get('province'),
            city: formData.get('city'),
            district: formData.get('district'),
            latitude: normalizeCoordinate(formData.get('latitude') as string),
            longitude: normalizeCoordinate(formData.get('longitude') as string)
        };

        const result = UpdateOutletSchema.safeParse(rawData);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await OutletService.update(result.data);
            return { success: true };
        } catch (e: any) {
            console.error('Update Outlet Error:', e);
            return fail(500, { message: 'Failed to update outlet' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        try {
            await OutletService.delete(id);
            return { success: true };
        } catch (e) {
            console.error('Delete Outlet Error:', e);
            return fail(500, { message: 'Failed to delete outlet' });
        }
    },

    bulkDelete: async ({ request }) => {
        const formData = await request.formData();
        const ids = JSON.parse(formData.get('ids') as string) as string[];

        try {
            await OutletService.bulkDelete(ids);
            return { success: true, count: ids.length };
        } catch (e) {
            console.error('Bulk Delete Error:', e);
            return fail(500, { message: 'Failed to delete outlets' });
        }
    }
};
