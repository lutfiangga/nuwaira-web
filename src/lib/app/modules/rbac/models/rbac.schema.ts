import { boolean, integer, pgTable, primaryKey, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const role = pgTable('role', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	isSystem: boolean('is_system').notNull().default(true),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export const permission = pgTable('permission', {
	code: text('code').primaryKey(),
	resource: text('resource').notNull(),
	action: text('action').notNull(),
	label: text('label').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export const rolePermission = pgTable(
	'role_permission',
	{
		roleId: text('role_id')
			.notNull()
			.references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		permissionCode: text('permission_code')
			.notNull()
			.references(() => permission.code, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => [
		primaryKey({
			columns: [table.roleId, table.permissionCode]
		})
	]
);

export const appSetting = pgTable('app_setting', {
	key: text('key').primaryKey(),
	value: text('value'),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export const panelModule = pgTable('panel_module', {
	id: text('id').primaryKey(),
	moduleKey: text('module_key').notNull().unique(),
	title: text('title').notNull(),
	url: text('url').notNull(),
	icon: text('icon').notNull().default('LayoutDashboard'),
	menuPermissionCode: text('menu_permission_code').references(() => permission.code, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	sortOrder: integer('sort_order').notNull().default(0),
	description: text('description'),
	isVisible: boolean('is_visible').notNull().default(true),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export const routePermission = pgTable(
	'route_permission',
	{
		id: text('id').primaryKey(),
		routeKey: text('route_key').notNull(),
		operationKey: text('operation_key').notNull(),
		routePath: text('route_path'),
		method: text('method'),
		description: text('description'),
		permissionCode: text('permission_code')
			.notNull()
			.references(() => permission.code, { onDelete: 'cascade', onUpdate: 'cascade' }),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
	},
	(table) => [
		uniqueIndex('route_permission_route_operation_idx').on(table.routeKey, table.operationKey)
	]
);

export type Role = typeof role.$inferSelect;
export type Permission = typeof permission.$inferSelect;
export type RolePermission = typeof rolePermission.$inferSelect;
export type AppSetting = typeof appSetting.$inferSelect;
export type PanelModule = typeof panelModule.$inferSelect;
export type RoutePermission = typeof routePermission.$inferSelect;
