import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import { CRUD_ROUTE_OPERATION_MAP } from '$lib/app/modules/rbac/config/rbac.config';

export async function getAccessProfileFromEvent(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return RbacService.getAccessProfile(event.locals.user.id);
}

export async function requirePermission(
	event: RequestEvent,
	routeKey: string,
	operationKey = 'read'
) {
	const accessProfile = await getAccessProfileFromEvent(event);
	const requiredPermissionCode = await RbacService.resolveRequiredPermissionCode(routeKey, operationKey);
	if (!requiredPermissionCode) {
		if (accessProfile.isSuperadmin) {
			return accessProfile;
		}

		const fallbackPermissionCode = `${routeKey}:${operationKey}`;
		if (RbacService.can(accessProfile, fallbackPermissionCode)) {
			return accessProfile;
		}

		throw error(403, `Forbidden: route access is not mapped (${routeKey}:${operationKey})`);
	}

	if (RbacService.can(accessProfile, requiredPermissionCode)) {
		return accessProfile;
	}

	throw error(403, `Forbidden: missing permission ${requiredPermissionCode}`);
}

export function guardPermission<T>(
	routeKey: string,
	operationKey: string,
	handler: (event: RequestEvent) => Promise<T>
) {
	return async (event: RequestEvent) => {
		await requirePermission(event, routeKey, operationKey);
		return handler(event);
	};
}

export function guardCrudActions<T extends Record<string, (event: RequestEvent) => Promise<unknown>>>(
	routeKey: string,
	actions: T
): T {
	const wrapped = Object.entries(actions).map(([actionName, handler]) => {
		const operationKey = CRUD_ROUTE_OPERATION_MAP[actionName as keyof typeof CRUD_ROUTE_OPERATION_MAP] || 'update';
		return [actionName, guardPermission(routeKey, operationKey, handler)] as const;
	});

	return Object.fromEntries(wrapped) as T;
}
