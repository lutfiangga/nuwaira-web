import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { guardPermission, requirePermission } from '$lib/app/middleware';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import {
	UpdateDefaultRoleSchema,
	UpdateRolePermissionsSchema
} from '$lib/app/modules/rbac/requests/rbac.request';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'rbac', 'read');
	return RbacService.getSettingsData();
};

const actionHandlers = {
	updateDefaultRole: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const payload = {
			defaultRoleId: formData.get('defaultRoleId')
		};

		const result = UpdateDefaultRoleSchema.safeParse(payload);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await RbacService.setDefaultRegisterRoleId(result.data.defaultRoleId);
			return { success: true, message: 'Default register role updated' };
		} catch (error) {
			console.error('updateDefaultRole error:', error);
			return fail(500, { message: 'Failed to update default register role' });
		}
	}),

	updateRolePermissions: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const payload = {
			roleId: formData.get('roleId'),
			permissionCodes: formData
				.getAll('permissionCodes')
				.filter((value): value is string => typeof value === 'string')
		};

		const result = UpdateRolePermissionsSchema.safeParse(payload);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await RbacService.updateRolePermissions(result.data.roleId, result.data.permissionCodes);
			return { success: true, message: 'Role permissions updated', roleId: result.data.roleId };
		} catch (error) {
			console.error('updateRolePermissions error:', error);
			return fail(500, { message: 'Failed to update role permissions' });
		}
	})
};

export const actions: Actions = actionHandlers as Actions;
