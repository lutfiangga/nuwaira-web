export const SUPERADMIN_ROLE_ID = 'superadmin';
export const DEFAULT_REGISTER_ROLE_ID = SUPERADMIN_ROLE_ID;

export const APP_SETTING_KEYS = {
	defaultRegisterRole: 'default_register_role'
} as const;

export const DEFAULT_PANEL_ICON = 'LayoutDashboard';

export const CRUD_ROUTE_OPERATION_MAP = {
	create: 'create',
	update: 'update',
	delete: 'delete',
	bulkDelete: 'delete'
} as const;
