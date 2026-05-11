import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { UpdateProfileSchema, ChangePasswordSchema } from '$lib/app/modules/user/requests/profile.request';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        throw redirect(302, '/login');
    }

    const currentUser = await UserService.getById(event.locals.user.id);
    return { currentUser };
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();

        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            age: formData.get('age'),
            photo: formData.get('photo'),
            photo_path: formData.get('photo_path')
        };

        const result = UpdateProfileSchema.safeParse(rawData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await UserService.updateProfile(locals.user.id, result.data);
            return { success: true, message: 'Profile updated successfully' };
        } catch (e: any) {
            console.error('Update Profile Error:', e);
            return fail(500, { message: e.message || 'Failed to update profile' });
        }
    },

    changePassword: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();

        const rawData = {
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        };

        const result = ChangePasswordSchema.safeParse(rawData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { message: 'Validation failed', errors });
        }

        try {
            await UserService.changePassword(locals.user.id, result.data);
            return { success: true, message: 'Password changed successfully' };
        } catch (e: any) {
            console.error('Change Password Error:', e);
            return fail(400, { message: e.message || 'Failed to change password' });
        }
    }
};
