import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { guardPermission, requirePermission } from '$lib/app/middleware';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import {
	CreatePanelModuleSchema,
	CreatePermissionSchema,
	CreateRoleSchema,
	CreateRoutePermissionSchema,
	DeletePanelModuleSchema,
	DeletePermissionSchema,
	DeleteRoleSchema,
	DeleteRoutePermissionSchema,
	UpdateDefaultRoleSchema,
	UpdatePanelModuleSchema,
	UpdatePermissionSchema,
	UpdateRolePermissionsSchema,
	UpdateRoleSchema,
	UpdateRoutePermissionSchema
} from '$lib/app/modules/rbac/requests/rbac.request';

const validationFail = (result: { error: { flatten: () => { fieldErrors: Record<string, string[]> } } }) =>
	fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });

const serviceFail = (message: string, rawError: unknown) => {
	console.error(message, rawError);
	if (rawError instanceof Error) {
		return fail(400, { message: rawError.message });
	}

	return fail(500, { message: 'Unexpected error' });
};

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'rbac', 'read');
	return RbacService.getSettingsData();
};

const actionHandlers = {
	createRole: guardPermission('rbac', 'create', async ({ request }) => {
		const formData = await request.formData();
		const result = CreateRoleSchema.safeParse({
			id: formData.get('id'),
			name: formData.get('name'),
			description: formData.get('description')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.createRole(result.data);
			return { success: true, message: 'Role created' };
		} catch (error) {
			return serviceFail('createRole error:', error);
		}
	}),

	updateRole: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdateRoleSchema.safeParse({
			id: formData.get('id'),
			name: formData.get('name'),
			description: formData.get('description')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.updateRole(result.data);
			return { success: true, message: 'Role updated' };
		} catch (error) {
			return serviceFail('updateRole error:', error);
		}
	}),

	deleteRole: guardPermission('rbac', 'delete', async ({ request }) => {
		const formData = await request.formData();
		const result = DeleteRoleSchema.safeParse({
			id: formData.get('id')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.deleteRole(result.data.id);
			return { success: true, message: 'Role deleted' };
		} catch (error) {
			return serviceFail('deleteRole error:', error);
		}
	}),

	updateDefaultRole: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdateDefaultRoleSchema.safeParse({
			defaultRoleId: formData.get('defaultRoleId')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.setDefaultRegisterRoleId(result.data.defaultRoleId);
			return { success: true, message: 'Default register role updated' };
		} catch (error) {
			return serviceFail('updateDefaultRole error:', error);
		}
	}),

	updateRolePermissions: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdateRolePermissionsSchema.safeParse({
			roleId: formData.get('roleId'),
			permissionCodes: formData
				.getAll('permissionCodes')
				.filter((value): value is string => typeof value === 'string')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.upsertRolePermissions(result.data.roleId, result.data.permissionCodes);
			return { success: true, message: 'Role permissions updated', roleId: result.data.roleId };
		} catch (error) {
			return serviceFail('updateRolePermissions error:', error);
		}
	}),

	createPermission: guardPermission('rbac', 'create', async ({ request }) => {
		const formData = await request.formData();
		const result = CreatePermissionSchema.safeParse({
			code: formData.get('code'),
			resource: formData.get('resource'),
			action: formData.get('action'),
			label: formData.get('label'),
			description: formData.get('description')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.createPermission(result.data);
			return { success: true, message: 'Permission created' };
		} catch (error) {
			return serviceFail('createPermission error:', error);
		}
	}),

	updatePermission: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdatePermissionSchema.safeParse({
			code: formData.get('code'),
			resource: formData.get('resource'),
			action: formData.get('action'),
			label: formData.get('label'),
			description: formData.get('description')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.updatePermission(result.data);
			return { success: true, message: 'Permission updated' };
		} catch (error) {
			return serviceFail('updatePermission error:', error);
		}
	}),

	deletePermission: guardPermission('rbac', 'delete', async ({ request }) => {
		const formData = await request.formData();
		const result = DeletePermissionSchema.safeParse({
			code: formData.get('code')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.deletePermission(result.data.code);
			return { success: true, message: 'Permission deleted' };
		} catch (error) {
			return serviceFail('deletePermission error:', error);
		}
	}),

	createPanelModule: guardPermission('rbac', 'create', async ({ request }) => {
		const formData = await request.formData();
		const result = CreatePanelModuleSchema.safeParse({
			moduleKey: formData.get('moduleKey'),
			title: formData.get('title'),
			url: formData.get('url'),
			icon: formData.get('icon'),
			menuPermissionCode: formData.get('menuPermissionCode'),
			sortOrder: formData.get('sortOrder'),
			description: formData.get('description'),
			isVisible: formData.get('isVisible'),
			isActive: formData.get('isActive')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.createPanelModule(result.data);
			return { success: true, message: 'Panel module created' };
		} catch (error) {
			return serviceFail('createPanelModule error:', error);
		}
	}),

	updatePanelModule: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdatePanelModuleSchema.safeParse({
			id: formData.get('id'),
			moduleKey: formData.get('moduleKey'),
			title: formData.get('title'),
			url: formData.get('url'),
			icon: formData.get('icon'),
			menuPermissionCode: formData.get('menuPermissionCode'),
			sortOrder: formData.get('sortOrder'),
			description: formData.get('description'),
			isVisible: formData.get('isVisible'),
			isActive: formData.get('isActive')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.updatePanelModule(result.data);
			return { success: true, message: 'Panel module updated' };
		} catch (error) {
			return serviceFail('updatePanelModule error:', error);
		}
	}),

	deletePanelModule: guardPermission('rbac', 'delete', async ({ request }) => {
		const formData = await request.formData();
		const result = DeletePanelModuleSchema.safeParse({
			id: formData.get('id')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.deletePanelModule(result.data.id);
			return { success: true, message: 'Panel module deleted' };
		} catch (error) {
			return serviceFail('deletePanelModule error:', error);
		}
	}),

	reorderPanelModules: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const idsJson = formData.get('ids');
		if (!idsJson || typeof idsJson !== 'string') {
			return fail(400, { message: 'Missing ids' });
		}

		try {
			const ids = JSON.parse(idsJson) as string[];
			await RbacService.reorderPanelModules(ids);
			return { success: true, message: 'Module order updated' };
		} catch (error) {
			return serviceFail('reorderPanelModules error:', error);
		}
	}),

	createRoutePermission: guardPermission('rbac', 'create', async ({ request }) => {
		const formData = await request.formData();
		const result = CreateRoutePermissionSchema.safeParse({
			routeKey: formData.get('routeKey'),
			operationKey: formData.get('operationKey'),
			routePath: formData.get('routePath'),
			method: formData.get('method'),
			description: formData.get('description'),
			permissionCode: formData.get('permissionCode'),
			isActive: formData.get('isActive')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.createRoutePermission(result.data);
			return { success: true, message: 'Route permission mapping created' };
		} catch (error) {
			return serviceFail('createRoutePermission error:', error);
		}
	}),

	updateRoutePermission: guardPermission('rbac', 'update', async ({ request }) => {
		const formData = await request.formData();
		const result = UpdateRoutePermissionSchema.safeParse({
			id: formData.get('id'),
			routeKey: formData.get('routeKey'),
			operationKey: formData.get('operationKey'),
			routePath: formData.get('routePath'),
			method: formData.get('method'),
			description: formData.get('description'),
			permissionCode: formData.get('permissionCode'),
			isActive: formData.get('isActive')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.updateRoutePermission(result.data);
			return { success: true, message: 'Route permission mapping updated' };
		} catch (error) {
			return serviceFail('updateRoutePermission error:', error);
		}
	}),

	deleteRoutePermission: guardPermission('rbac', 'delete', async ({ request }) => {
		const formData = await request.formData();
		const result = DeleteRoutePermissionSchema.safeParse({
			id: formData.get('id')
		});

		if (!result.success) {
			return validationFail(result);
		}

		try {
			await RbacService.deleteRoutePermission(result.data.id);
			return { success: true, message: 'Route permission mapping deleted' };
		} catch (error) {
			return serviceFail('deleteRoutePermission error:', error);
		}
	})
};

export const actions: Actions = actionHandlers as Actions;
