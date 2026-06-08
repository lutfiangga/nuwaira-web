import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { CreateUserSchema, UpdateUserSchema } from '$lib/app/modules/user/requests/user.request';

function requireAdmin(event: RequestEvent) {
	if (!event.locals.user) {
		redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		redirect(302, '/dashboard');
	}
}

export const load: PageServerLoad = async (event) => {
	requireAdmin(event);

	const search = event.url.searchParams.get('search') ?? '';
	const page = Number(event.url.searchParams.get('page')) || 1;
	const pageSize = Number(event.url.searchParams.get('pageSize')) || 10;
	const sort = event.url.searchParams.get('sort') ?? 'email';
	const order = event.url.searchParams.get('order') ?? 'asc';

	const { users, total } = await UserService.getAll({ search, page, pageSize, sort, order });

	return {
		users,
		pagination: {
			page,
			limit: pageSize,
			total
		},
		params: {
			search,
			sort,
			order
		}
	};
};

export const actions: Actions = {
	create: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const rawData = {
			email: formData.get('email'),
			role: formData.get('role'),
			password: formData.get('password'),
			photo: formData.get('photo')
		};

		const result = CreateUserSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await UserService.create(result.data);
			return { success: true };
		} catch (e: any) {
			console.error('Create User Error:', e);
			if (e.code === '23505') {
				return fail(400, { message: 'Email already taken' });
			}
			return fail(500, { message: 'Failed to create user. ' + (e.message || '') });
		}
	},

	update: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const rawData = {
			id: formData.get('id'),
			email: formData.get('email'),
			role: formData.get('role'),
			password: formData.get('password'),
			photo: formData.get('photo'),
			photoDeleted: formData.get('photo_removed')
		};

		const result = UpdateUserSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await UserService.update(result.data);
			return { success: true };
		} catch (e: any) {
			console.error('Update User Error:', e);
			if (e.code === '23505') {
				return fail(400, { message: 'Email already taken' });
			}
			return fail(500, { message: 'Failed to update user' });
		}
	},

	delete: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		try {
			await UserService.delete(id);
			return { success: true };
		} catch (e) {
			console.error('Delete User Error:', e);
			return fail(500, { message: 'Failed to delete user' });
		}
	},

	bulkDelete: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await UserService.bulkDelete(ids);
			return { success: true, count: ids.length };
		} catch (e) {
			console.error('Bulk Delete Error:', e);
			return fail(500, { message: 'Failed to delete users' });
		}
	}
};
