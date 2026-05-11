import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { CreateUserSchema, UpdateUserSchema } from '$lib/app/modules/user/requests/user.request';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const sort = url.searchParams.get('sort') ?? 'username';
	const order = url.searchParams.get('order') ?? 'asc';

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
	// CREATE
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			username: formData.get('username'),
			password: formData.get('password'),
			age: formData.get('age'),
			photo: formData.get('photo'),
			photo_path: formData.get('photo_path')
		};

		const result = CreateUserSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });
		}

		try {
			await UserService.create(result.data);
			return { success: true };
		} catch (e: any) {
			console.error('Create User Error:', e);
			if (e.code === '23505') {
				return fail(400, { message: 'Username already taken' });
			}
			return fail(500, { message: 'Failed to create user. ' + (e.message || '') });
		}
	},

	// UPDATE
	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			username: formData.get('username'),
			password: formData.get('password'),
			age: formData.get('age'),
			photo: formData.get('photo'),
			photo_path: formData.get('photo_path')
		};

		const result = UpdateUserSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });
		}

		try {
			await UserService.update(result.data);
			return { success: true };
		} catch (e: any) {
			console.error('Update User Error:', e);
			if (e.code === '23505') {
				return fail(400, { message: 'Username already taken' });
			}
			return fail(500, { message: 'Failed to update user' });
		}
	},

	// DELETE single
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await UserService.delete(id);
			return { success: true };
		} catch (e) {
			console.error('Delete User Error:', e);
			return fail(500, { message: 'Failed to delete user' });
		}
	},

	// BULK DELETE
	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
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
