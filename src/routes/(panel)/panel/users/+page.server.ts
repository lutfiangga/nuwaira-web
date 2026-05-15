import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { CreateUserSchema, UpdateUserSchema } from '$lib/app/modules/user/requests/user.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'users', 'read');

	const search = event.url.searchParams.get('search') ?? '';
	const page = Number(event.url.searchParams.get('page')) || 1;
	const pageSize = Number(event.url.searchParams.get('pageSize')) || 10;
	const sort = event.url.searchParams.get('sort') ?? 'username';
	const order = event.url.searchParams.get('order') ?? 'asc';

	const [{ users, total }, roleOptions] = await Promise.all([
		UserService.getAll({ search, page, pageSize, sort, order }),
		RbacService.listRoleOptions()
	]);

	return {
		users,
		roleOptions,
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

const actionHandlers = guardCrudActions('users', {
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			username: formData.get('username'),
			email: formData.get('email'),
			roleId: formData.get('roleId'),
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
				return fail(400, { message: 'Username or email already taken' });
			}
			return fail(500, { message: 'Failed to create user. ' + (e.message || '') });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			username: formData.get('username'),
			email: formData.get('email'),
			roleId: formData.get('roleId'),
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
				return fail(400, { message: 'Username or email already taken' });
			}
			return fail(500, { message: 'Failed to update user' });
		}
	},

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
});

export const actions: Actions = actionHandlers as Actions;
