import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { user } from '$lib/app/modules/user/models/user.schema';
import {
	appSetting,
	panelModule,
	permission,
	role,
	rolePermission,
	routePermission
} from '../models/rbac.schema';
import {
	APP_SETTING_KEYS,
	DEFAULT_PANEL_ICON,
	DEFAULT_REGISTER_ROLE_ID,
	SUPERADMIN_ROLE_ID
} from '../config/rbac.config';
import { logDbError, withDbFallback } from '$lib/app/server/db';

export interface AccessProfile {
	roleId: string;
	roleName: string;
	permissionCodes: string[];
	isSuperadmin: boolean;
}

export interface RoleOption {
	value: string;
	label: string;
}

export interface RbacSettingsData {
	roles: Array<{
		id: string;
		name: string;
		description: string | null;
		isSystem: boolean;
	}>;
	permissions: Array<{
		code: string;
		resource: string;
		action: string;
		label: string;
		description: string | null;
	}>;
	rolePermissionMap: Record<string, string[]>;
	defaultRegisterRoleId: string;
	panelModules: Array<{
		id: string;
		moduleKey: string;
		title: string;
		url: string;
		icon: string;
		menuPermissionCode: string | null;
		sortOrder: number;
		description: string | null;
		isVisible: boolean;
		isActive: boolean;
	}>;
	routePermissions: Array<{
		id: string;
		routeKey: string;
		operationKey: string;
		routePath: string | null;
		method: string | null;
		description: string | null;
		permissionCode: string;
		isActive: boolean;
	}>;
}

const FALLBACK_ACCESS_PROFILE: AccessProfile = {
	roleId: SUPERADMIN_ROLE_ID,
	roleName: 'Superadmin',
	permissionCodes: [],
	isSuperadmin: true
};

const EMPTY_SETTINGS_DATA: RbacSettingsData = {
	roles: [],
	permissions: [],
	rolePermissionMap: {},
	defaultRegisterRoleId: DEFAULT_REGISTER_ROLE_ID,
	panelModules: [],
	routePermissions: []
};

const FALLBACK_PANEL_ICON_MAP: Record<string, string> = {
	dashboard: 'LayoutDashboard',
	users: 'Users',
	students: 'Users',
	classes: 'Package',
	materials: 'FolderOpen',
	enrollments: 'ChartColumnStacked',
	settings: 'SettingsIcon',
	rbac: 'ShieldCheck'
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

				const fallbackRoleId = await this.getDefaultRegisterRoleId();
				const roleId = userRow?.roleId || fallbackRoleId;

				const [roleRow, permissionRows] = await Promise.all([
					db.select({ name: role.name }).from(role).where(eq(role.id, roleId)).limit(1),
					db
						.select({ permissionCode: rolePermission.permissionCode })
						.from(rolePermission)
						.where(eq(rolePermission.roleId, roleId))
				]);

				const permissionCodes = permissionRows.map((row) => row.permissionCode);

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

	static can(accessProfile: AccessProfile, permissionCode: string) {
		if (accessProfile.isSuperadmin) {
			return true;
		}

		return accessProfile.permissionCodes.includes(permissionCode);
	}

	static async getVisiblePanelMenus(accessProfile: AccessProfile) {
		try {
			const modules = await db
				.select({
					moduleKey: panelModule.moduleKey,
					title: panelModule.title,
					url: panelModule.url,
					icon: panelModule.icon,
					menuPermissionCode: panelModule.menuPermissionCode,
					sortOrder: panelModule.sortOrder
				})
				.from(panelModule)
				.where(and(eq(panelModule.isActive, true), eq(panelModule.isVisible, true)))
				.orderBy(asc(panelModule.sortOrder), asc(panelModule.title));

			if (accessProfile.isSuperadmin) {
					return modules.map((module) => ({
						key: module.moduleKey,
						title: module.title,
						url: this.normalizePanelUrl(module.url),
						icon: module.icon || DEFAULT_PANEL_ICON,
						permissionCode: module.menuPermissionCode
					}));
			}

			const granted = new Set(accessProfile.permissionCodes);
			return modules
				.filter((module) => !module.menuPermissionCode || granted.has(module.menuPermissionCode))
				.map((module) => ({
					key: module.moduleKey,
					title: module.title,
					url: this.normalizePanelUrl(module.url),
					icon: module.icon || DEFAULT_PANEL_ICON,
					permissionCode: module.menuPermissionCode
				}));
		} catch (error) {
			if (this.isMissingRelationError(error, 'panel_module')) {
				return this.getFallbackPanelMenus(accessProfile);
			}

			logDbError('RbacService.getVisiblePanelMenus', error);
			return [];
		}
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
		await this.assertRoleExists(roleId);
		await db
			.insert(appSetting)
			.values({
				key: APP_SETTING_KEYS.defaultRegisterRole,
				value: roleId,
				updatedAt: new Date()
			})
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
			[{ value: SUPERADMIN_ROLE_ID, label: 'Superadmin' }]
		);
	}

	static async getSettingsData(): Promise<RbacSettingsData> {
		return withDbFallback(
			'RbacService.getSettingsData',
			async () => {
				const [roles, permissions, links, modules, routes, defaultRegisterRoleId] = await Promise.all([
					db
						.select({
							id: role.id,
							name: role.name,
							description: role.description,
							isSystem: role.isSystem
						})
						.from(role)
						.orderBy(asc(role.name)),
					db
						.select({
							code: permission.code,
							resource: permission.resource,
							action: permission.action,
							label: permission.label,
							description: permission.description
						})
						.from(permission)
						.orderBy(asc(permission.resource), asc(permission.action)),
					db
						.select({
							roleId: rolePermission.roleId,
							permissionCode: rolePermission.permissionCode
						})
						.from(rolePermission),
					db
						.select({
							id: panelModule.id,
							moduleKey: panelModule.moduleKey,
							title: panelModule.title,
							url: panelModule.url,
							icon: panelModule.icon,
							menuPermissionCode: panelModule.menuPermissionCode,
							sortOrder: panelModule.sortOrder,
							description: panelModule.description,
							isVisible: panelModule.isVisible,
							isActive: panelModule.isActive
						})
						.from(panelModule)
						.orderBy(asc(panelModule.sortOrder), asc(panelModule.title)),
					db
						.select({
							id: routePermission.id,
							routeKey: routePermission.routeKey,
							operationKey: routePermission.operationKey,
							routePath: routePermission.routePath,
							method: routePermission.method,
							description: routePermission.description,
							permissionCode: routePermission.permissionCode,
							isActive: routePermission.isActive
						})
						.from(routePermission)
						.orderBy(asc(routePermission.routeKey), asc(routePermission.operationKey)),
					this.getDefaultRegisterRoleId()
				]);

				return {
					roles,
					permissions,
					rolePermissionMap: this.toRolePermissionMap(links),
					defaultRegisterRoleId,
					panelModules: modules,
					routePermissions: routes
				};
			},
			EMPTY_SETTINGS_DATA
		);
	}

	static async createRole(payload: { id: string; name: string; description?: string | null }) {
		await db.insert(role).values({
			id: payload.id.trim(),
			name: payload.name.trim(),
			description: payload.description || null,
			isSystem: false
		});
	}

	static async updateRole(payload: { id: string; name: string; description?: string | null }) {
		await this.assertRoleExists(payload.id);
		await db
			.update(role)
			.set({
				name: payload.name.trim(),
				description: payload.description || null,
				updatedAt: new Date()
			})
			.where(eq(role.id, payload.id));
	}

	static async deleteRole(roleId: string) {
		if (roleId === SUPERADMIN_ROLE_ID) {
			throw new Error('Bootstrap superadmin role cannot be deleted');
		}

		const defaultRoleId = await this.getDefaultRegisterRoleId();
		if (defaultRoleId === roleId) {
			await this.setDefaultRegisterRoleId(SUPERADMIN_ROLE_ID);
		}

		const [assignedUser] = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.roleId, roleId))
			.limit(1);
		if (assignedUser) {
			throw new Error('Role still used by users');
		}

		await db.delete(role).where(eq(role.id, roleId));
	}

	static async upsertRolePermissions(roleId: string, permissionCodes: string[]) {
		await this.assertRoleExists(roleId);
		const normalizedCodes = await this.resolveValidPermissionCodes(permissionCodes);

		const effectiveCodes =
			roleId === SUPERADMIN_ROLE_ID ? await this.getAllPermissionCodes() : normalizedCodes;

		await db.transaction(async (trx) => {
			await trx.delete(rolePermission).where(eq(rolePermission.roleId, roleId));
			if (effectiveCodes.length === 0) {
				return;
			}

			await trx.insert(rolePermission).values(
				effectiveCodes.map((permissionCode) => ({
					roleId,
					permissionCode
				}))
			);
		});
	}

	static async createPermission(payload: {
		code: string;
		resource: string;
		action: string;
		label: string;
		description?: string | null;
	}) {
		await db.insert(permission).values({
			code: payload.code.trim(),
			resource: payload.resource.trim(),
			action: payload.action.trim(),
			label: payload.label.trim(),
			description: payload.description || null
		});
	}

	static async updatePermission(payload: {
		code: string;
		resource: string;
		action: string;
		label: string;
		description?: string | null;
	}) {
		const [existingPermission] = await db
			.select({ code: permission.code })
			.from(permission)
			.where(eq(permission.code, payload.code))
			.limit(1);
		if (!existingPermission) {
			throw new Error('Permission not found');
		}

		await db
			.update(permission)
			.set({
				resource: payload.resource.trim(),
				action: payload.action.trim(),
				label: payload.label.trim(),
				description: payload.description || null,
				updatedAt: new Date()
			})
			.where(eq(permission.code, payload.code));
	}

	static async deletePermission(code: string) {
		await db.delete(permission).where(eq(permission.code, code));
	}

	static async createPanelModule(payload: {
		moduleKey: string;
		title: string;
		url: string;
		icon?: string;
		menuPermissionCode?: string | null;
		sortOrder?: number;
		description?: string | null;
		isVisible: boolean;
		isActive: boolean;
	}) {
		await this.assertValidPermissionCode(payload.menuPermissionCode || null);
		await db.insert(panelModule).values({
			id: crypto.randomUUID(),
			moduleKey: payload.moduleKey.trim(),
			title: payload.title.trim(),
			url: payload.url.trim(),
			icon: payload.icon?.trim() || DEFAULT_PANEL_ICON,
			menuPermissionCode: payload.menuPermissionCode || null,
			sortOrder: payload.sortOrder ?? 0,
			description: payload.description || null,
			isVisible: payload.isVisible,
			isActive: payload.isActive
		});
	}

	static async updatePanelModule(payload: {
		id: string;
		moduleKey: string;
		title: string;
		url: string;
		icon?: string;
		menuPermissionCode?: string | null;
		sortOrder?: number;
		description?: string | null;
		isVisible: boolean;
		isActive: boolean;
	}) {
		await this.assertValidPermissionCode(payload.menuPermissionCode || null);
		await db
			.update(panelModule)
			.set({
				moduleKey: payload.moduleKey.trim(),
				title: payload.title.trim(),
				url: payload.url.trim(),
				icon: payload.icon?.trim() || DEFAULT_PANEL_ICON,
				menuPermissionCode: payload.menuPermissionCode || null,
				sortOrder: payload.sortOrder ?? 0,
				description: payload.description || null,
				isVisible: payload.isVisible,
				isActive: payload.isActive,
				updatedAt: new Date()
			})
			.where(eq(panelModule.id, payload.id));
	}

	static async deletePanelModule(id: string) {
		await db.delete(panelModule).where(eq(panelModule.id, id));
	}

	static async reorderPanelModules(ids: string[]) {
		await db.transaction(async (trx) => {
			for (let i = 0; i < ids.length; i++) {
				await trx.update(panelModule).set({ sortOrder: i }).where(eq(panelModule.id, ids[i]));
			}
		});
	}

	static async createRoutePermission(payload: {
		routeKey: string;
		operationKey: string;
		routePath?: string | null;
		method?: string | null;
		description?: string | null;
		permissionCode: string;
		isActive: boolean;
	}) {
		await this.assertValidPermissionCode(payload.permissionCode);
		await db.insert(routePermission).values({
			id: crypto.randomUUID(),
			routeKey: payload.routeKey.trim(),
			operationKey: payload.operationKey.trim(),
			routePath: payload.routePath?.trim() || null,
			method: payload.method?.trim() || null,
			description: payload.description || null,
			permissionCode: payload.permissionCode.trim(),
			isActive: payload.isActive
		});
	}

	static async updateRoutePermission(payload: {
		id: string;
		routeKey: string;
		operationKey: string;
		routePath?: string | null;
		method?: string | null;
		description?: string | null;
		permissionCode: string;
		isActive: boolean;
	}) {
		await this.assertValidPermissionCode(payload.permissionCode);
		await db
			.update(routePermission)
			.set({
				routeKey: payload.routeKey.trim(),
				operationKey: payload.operationKey.trim(),
				routePath: payload.routePath?.trim() || null,
				method: payload.method?.trim() || null,
				description: payload.description || null,
				permissionCode: payload.permissionCode.trim(),
				isActive: payload.isActive,
				updatedAt: new Date()
			})
			.where(eq(routePermission.id, payload.id));
	}

	static async deleteRoutePermission(id: string) {
		await db.delete(routePermission).where(eq(routePermission.id, id));
	}

	static async resolveRequiredPermissionCode(routeKey: string, operationKey: string) {
		try {
			const [mapping] = await db
				.select({
					permissionCode: routePermission.permissionCode
				})
				.from(routePermission)
				.where(
					and(
						eq(routePermission.routeKey, routeKey),
						eq(routePermission.operationKey, operationKey),
						eq(routePermission.isActive, true)
					)
				)
				.limit(1);

			return mapping?.permissionCode || null;
		} catch (error) {
			if (this.isMissingRelationError(error, 'route_permission')) {
				const fallbackCode = `${routeKey}:${operationKey}`;
				const [existingPermission] = await db
					.select({ code: permission.code })
					.from(permission)
					.where(eq(permission.code, fallbackCode))
					.limit(1);

				return existingPermission?.code || null;
			}

			logDbError('RbacService.resolveRequiredPermissionCode', error);
			return null;
		}
	}

	private static async getAllPermissionCodes() {
		const rows = await db.select({ code: permission.code }).from(permission);
		return rows.map((row) => row.code);
	}

	private static toRolePermissionMap(
		links: Array<{ roleId: string; permissionCode: string }>
	): Record<string, string[]> {
		return links.reduce<Record<string, string[]>>((acc, link) => {
			const currentCodes = acc[link.roleId] ?? [];
			return {
				...acc,
				[link.roleId]: [...currentCodes, link.permissionCode]
			};
		}, {});
	}

	private static async assertRoleExists(roleId: string) {
		const [existingRole] = await db.select({ id: role.id }).from(role).where(eq(role.id, roleId)).limit(1);
		if (!existingRole) {
			throw new Error('Role not found');
		}
	}

	private static async assertValidPermissionCode(permissionCode: string | null) {
		if (!permissionCode) {
			return;
		}

		const [existingPermission] = await db
			.select({ code: permission.code })
			.from(permission)
			.where(eq(permission.code, permissionCode))
			.limit(1);
		if (!existingPermission) {
			throw new Error('Permission not found');
		}
	}

	private static async resolveValidPermissionCodes(permissionCodes: string[]) {
		const uniqueCodes = Array.from(new Set(permissionCodes.map((code) => code.trim()).filter(Boolean)));
		if (uniqueCodes.length === 0) {
			return [];
		}

		const rows = await db
			.select({ code: permission.code })
			.from(permission)
			.where(inArray(permission.code, uniqueCodes));

		return rows.map((row) => row.code);
	}

	private static async getFallbackPanelMenus(accessProfile: AccessProfile) {
		try {
			const readPermissions = await db
				.select({
					code: permission.code,
					resource: permission.resource
				})
				.from(permission)
				.where(eq(permission.action, 'read'))
				.orderBy(asc(permission.resource));

			const grantedCodes = new Set(accessProfile.permissionCodes);
			return readPermissions
				.filter((entry) => accessProfile.isSuperadmin || grantedCodes.has(entry.code))
				.map((entry) => ({
					key: entry.resource,
					title: this.toTitleCase(entry.resource),
					url: `/${entry.resource}`,
					icon: FALLBACK_PANEL_ICON_MAP[entry.resource] || DEFAULT_PANEL_ICON,
					permissionCode: entry.code
				}));
		} catch (error) {
			logDbError('RbacService.getFallbackPanelMenus', error);
			return [];
		}
	}

	private static toTitleCase(value: string) {
		return value
			.split(/[_-]/g)
			.filter(Boolean)
			.map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
			.join(' ');
	}

	private static normalizePanelUrl(url: string) {
		if (url.startsWith('/panel/')) {
			return url.replace('/panel/', '/');
		}

		if (url === '/panel') {
			return '/dashboard';
		}

		return url;
	}

	private static isMissingRelationError(error: unknown, relationName: string) {
		if (!(error instanceof Error)) {
			return false;
		}

		const candidate = error as Error & { cause?: { code?: string; message?: string } };
		const causeCode = candidate.cause?.code;
		const message = candidate.message || '';
		const causeMessage = candidate.cause?.message || '';

		return (
			causeCode === '42P01' ||
			message.includes(`relation "${relationName}" does not exist`) ||
			causeMessage.includes(`relation "${relationName}" does not exist`)
		);
	}
}
