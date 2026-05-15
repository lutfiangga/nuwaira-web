import { boolean, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

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
			.references(() => role.id, { onDelete: 'cascade' }),
		permissionCode: text('permission_code')
			.notNull()
			.references(() => permission.code, { onDelete: 'cascade' })
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

export type Role = typeof role.$inferSelect;
export type Permission = typeof permission.$inferSelect;
export type RolePermission = typeof rolePermission.$inferSelect;
export type AppSetting = typeof appSetting.$inferSelect;
