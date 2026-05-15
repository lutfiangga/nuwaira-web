import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import type { PermissionAction, PermissionResource } from '$lib/app/modules/rbac/config/rbac.config';

const ACTION_PERMISSION_MAP: Record<string, PermissionAction> = {
	create: 'create',
	update: 'update',
	delete: 'delete',
	bulkDelete: 'delete'
};

export async function getAccessProfileFromEvent(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return RbacService.getAccessProfile(event.locals.user.id);
}

export async function requirePermission(
	event: RequestEvent,
	resource: PermissionResource,
	action: PermissionAction = 'read'
) {
	const accessProfile = await getAccessProfileFromEvent(event);
	if (RbacService.can(accessProfile, resource, action)) {
		return accessProfile;
	}

	throw error(403, `Forbidden: missing permission ${resource}:${action}`);
}

export function guardPermission<T>(
	resource: PermissionResource,
	action: PermissionAction,
	handler: (event: RequestEvent) => Promise<T>
) {
	return async (event: RequestEvent) => {
		await requirePermission(event, resource, action);
		return handler(event);
	};
}

export function guardCrudActions<T extends Record<string, (event: RequestEvent) => Promise<unknown>>>(
	resource: PermissionResource,
	actions: T
): T {
	const wrapped = Object.entries(actions).map(([actionName, handler]) => {
		const permissionAction = ACTION_PERMISSION_MAP[actionName] || 'update';
		return [actionName, guardPermission(resource, permissionAction, handler)] as const;
	});

	return Object.fromEntries(wrapped) as T;
}
