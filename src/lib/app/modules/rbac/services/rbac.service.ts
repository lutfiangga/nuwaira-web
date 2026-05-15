import { asc, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { user } from '$lib/app/modules/user/models/user.schema';
import { appSetting, permission, role, rolePermission } from '../models/rbac.schema';
import {
	APP_SETTING_KEYS,
	DEFAULT_REGISTER_ROLE_ID,
	PANEL_MENU_ITEMS,
	PANEL_RESOURCE_POLICY,
	PERMISSION_LABELS,
	SUPERADMIN_ROLE_ID,
	SYSTEM_ROLES,
	type PermissionAction,
	type PermissionCode,
	type PermissionResource
} from '../config/rbac.config';
import { withDbFallback } from '$lib/app/server/db';

export interface AccessProfile {
	roleId: string;
	roleName: string;
	permissionCodes: PermissionCode[];
	isSuperadmin: boolean;
}

export interface RoleOption {
	value: string;
	label: string;
}

export interface RbacSettingsData {
	roles: Array<{ id: string; name: string; description: string | null }>;
	permissions: Array<{ code: string; resource: string; action: string; label: string }>;
	rolePermissionMap: Record<string, string[]>;
	defaultRegisterRoleId: string;
}

const PERMISSION_CATALOG: Array<{
	code: PermissionCode;
	resource: PermissionResource;
	action: PermissionAction;
	label: string;
	description: string;
}> = Object.entries(PANEL_RESOURCE_POLICY).flatMap(([resource, actions]) =>
	actions.map((action) => {
		const code = `${resource}:${action}` as PermissionCode;
		return {
			code,
			resource: resource as PermissionResource,
			action: action as PermissionAction,
			label: PERMISSION_LABELS[code],
			description: `Allow ${action} on ${resource}`
		};
	})
);

const FALLBACK_ACCESS_PROFILE: AccessProfile = {
	roleId: DEFAULT_REGISTER_ROLE_ID,
	roleName: 'Learner',
	permissionCodes: [],
	isSuperadmin: false
};

export class RbacService {
	static async getAccessProfile(userId: string): Promise<AccessProfile> {
		return withDbFallback(
			'RbacService.getAccessProfile',
			async () => {
				const [userRow] = await db
					.select({ roleId: user.roleId })
					.from(user)
					.where(eq(user.id, userId))
					.limit(1);

				const roleId = userRow?.roleId || DEFAULT_REGISTER_ROLE_ID;
				const [roleRow, permissionRows] = await Promise.all([
					db
						.select({ name: role.name })
						.from(role)
						.where(eq(role.id, roleId))
						.limit(1),
					db
						.select({ permissionCode: rolePermission.permissionCode })
						.from(rolePermission)
						.where(eq(rolePermission.roleId, roleId))
				]);

				const permissionCodes = permissionRows.map((row) => row.permissionCode as PermissionCode);

				return {
					roleId,
					roleName: roleRow.at(0)?.name || roleId,
					permissionCodes,
					isSuperadmin: roleId === SUPERADMIN_ROLE_ID
				};
			},
			FALLBACK_ACCESS_PROFILE
		);
	}

	static can(accessProfile: AccessProfile, resource: PermissionResource, action: PermissionAction): boolean {
		if (accessProfile.isSuperadmin) {
			return true;
		}

		const code = `${resource}:${action}` as PermissionCode;
		return accessProfile.permissionCodes.includes(code);
	}

	static getVisiblePanelMenus(accessProfile: AccessProfile) {
		if (accessProfile.isSuperadmin) {
			return PANEL_MENU_ITEMS;
		}

		const granted = new Set(accessProfile.permissionCodes);
		return PANEL_MENU_ITEMS.filter((item) => granted.has(item.permissionCode));
	}

	static async getDefaultRegisterRoleId() {
		return withDbFallback(
			'RbacService.getDefaultRegisterRoleId',
			async () => {
				const [setting] = await db
					.select({ value: appSetting.value })
					.from(appSetting)
					.where(eq(appSetting.key, APP_SETTING_KEYS.defaultRegisterRole))
					.limit(1);

				return setting?.value || DEFAULT_REGISTER_ROLE_ID;
			},
			DEFAULT_REGISTER_ROLE_ID
		);
	}

	static async setDefaultRegisterRoleId(roleId: string) {
		const [existingRole] = await db.select({ id: role.id }).from(role).where(eq(role.id, roleId)).limit(1);
		if (!existingRole) {
			throw new Error('Role not found');
		}

		await db
			.insert(appSetting)
			.values({ key: APP_SETTING_KEYS.defaultRegisterRole, value: roleId, updatedAt: new Date() })
			.onConflictDoUpdate({
				target: appSetting.key,
				set: { value: roleId, updatedAt: new Date() }
			});
	}

	static async listRoleOptions(): Promise<RoleOption[]> {
		return withDbFallback(
			'RbacService.listRoleOptions',
			async () => {
				const roles = await db.select({ id: role.id, name: role.name }).from(role).orderBy(asc(role.name));
				return roles.map((entry) => ({ value: entry.id, label: entry.name }));
			},
			SYSTEM_ROLES.map((entry) => ({ value: entry.id, label: entry.name }))
		);
	}

	static async getSettingsData(): Promise<RbacSettingsData> {
		return withDbFallback(
			'RbacService.getSettingsData',
			async () => {
				const [roles, permissions, links, defaultRegisterRoleId] = await Promise.all([
					db
						.select({ id: role.id, name: role.name, description: role.description })
						.from(role)
						.orderBy(asc(role.name)),
					db
						.select({ code: permission.code, resource: permission.resource, action: permission.action, label: permission.label })
						.from(permission)
						.orderBy(asc(permission.resource), asc(permission.action)),
					db
						.select({ roleId: rolePermission.roleId, permissionCode: rolePermission.permissionCode })
						.from(rolePermission),
					this.getDefaultRegisterRoleId()
				]);

				const rolePermissionMap = links.reduce<Record<string, string[]>>((acc, link) => {
					const current = acc[link.roleId] || [];
					return {
						...acc,
						[link.roleId]: [...current, link.permissionCode]
					};
				}, {});

				return {
					roles,
					permissions,
					rolePermissionMap,
					defaultRegisterRoleId
				};
			},
			{
				roles: SYSTEM_ROLES.map((entry) => ({
					id: entry.id,
					name: entry.name,
					description: entry.description
				})),
				permissions: PERMISSION_CATALOG,
				rolePermissionMap: {
					[SUPERADMIN_ROLE_ID]: PERMISSION_CATALOG.map((entry) => entry.code)
				},
				defaultRegisterRoleId: DEFAULT_REGISTER_ROLE_ID
			}
		);
	}

	static async updateRolePermissions(roleId: string, permissionCodes: string[]) {
		const [existingRole] = await db.select({ id: role.id }).from(role).where(eq(role.id, roleId)).limit(1);
		if (!existingRole) {
			throw new Error('Role not found');
		}

		const normalizedCodes = await this.resolveValidPermissionCodes(permissionCodes);
		const targetCodes = roleId === SUPERADMIN_ROLE_ID ? PERMISSION_CATALOG.map((entry) => entry.code) : normalizedCodes;

		await db.transaction(async (trx) => {
			await trx.delete(rolePermission).where(eq(rolePermission.roleId, roleId));
			if (targetCodes.length === 0) {
				return;
			}

			await trx.insert(rolePermission).values(
				targetCodes.map((permissionCode) => ({
					roleId,
					permissionCode
				}))
			);
		});
	}

	private static async resolveValidPermissionCodes(permissionCodes: string[]) {
		const uniqueCodes = Array.from(new Set(permissionCodes));
		if (uniqueCodes.length === 0) {
			return [];
		}

		const rows = await db
			.select({ code: permission.code })
			.from(permission)
			.where(inArray(permission.code, uniqueCodes));

		return rows.map((row) => row.code as PermissionCode);
	}
}
