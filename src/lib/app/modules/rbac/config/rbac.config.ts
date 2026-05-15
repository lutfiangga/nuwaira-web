export const SUPERADMIN_ROLE_ID = 'superadmin';
export const DEFAULT_REGISTER_ROLE_ID = 'learner';

export const SYSTEM_ROLES = [
	{
		id: SUPERADMIN_ROLE_ID,
		name: 'Superadmin',
		description: 'Full control over all features and RBAC policy'
	},
	{
		id: 'admin',
		name: 'Admin',
		description: 'Operational admin with configurable access'
	},
	{
		id: 'instructor',
		name: 'Instructor',
		description: 'Content manager for learning materials'
	},
	{
		id: DEFAULT_REGISTER_ROLE_ID,
		name: 'Learner',
		description: 'Default role for self-registered users'
	}
] as const;

export type SystemRoleId = (typeof SYSTEM_ROLES)[number]['id'];

export const PANEL_RESOURCE_POLICY = {
	dashboard: ['read'],
	users: ['create', 'read', 'update', 'delete'],
	students: ['create', 'read', 'update', 'delete'],
	classes: ['create', 'read', 'update', 'delete'],
	materials: ['create', 'read', 'update', 'delete'],
	enrollments: ['create', 'read', 'update', 'delete'],
	menu: ['create', 'read', 'update', 'delete'],
	moments: ['create', 'read', 'update', 'delete'],
	categories: ['create', 'read', 'update', 'delete'],
	products: ['create', 'read', 'update', 'delete'],
	outlets: ['create', 'read', 'update', 'delete'],
	outlet_map: ['read'],
	news: ['create', 'read', 'update', 'delete'],
	settings: ['read', 'update'],
	rbac: ['read', 'update']
} as const;

export type PermissionResource = keyof typeof PANEL_RESOURCE_POLICY;
export type PermissionAction = (typeof PANEL_RESOURCE_POLICY)[PermissionResource][number];

export type PermissionCode = `${PermissionResource}:${PermissionAction}`;

export const APP_SETTING_KEYS = {
	defaultRegisterRole: 'default_register_role'
} as const;

export const PANEL_MENU_ITEMS: Array<{
	key: string;
	title: string;
	url: string;
	icon: string;
	permissionCode: PermissionCode;
}> = [
	{
		key: 'dashboard',
		title: 'Dashboard',
		url: '/panel/dashboard',
		icon: 'LayoutDashboard',
		permissionCode: 'dashboard:read'
	},
	{
		key: 'users',
		title: 'Users',
		url: '/panel/users',
		icon: 'Users',
		permissionCode: 'users:read'
	},
	{
		key: 'students',
		title: 'Students',
		url: '/panel/students',
		icon: 'Users',
		permissionCode: 'students:read'
	},
	{
		key: 'classes',
		title: 'Classes',
		url: '/panel/classes',
		icon: 'Package',
		permissionCode: 'classes:read'
	},
	{
		key: 'materials',
		title: 'Materials',
		url: '/panel/materials',
		icon: 'FolderOpen',
		permissionCode: 'materials:read'
	},
	{
		key: 'enrollments',
		title: 'Enrollments',
		url: '/panel/enrollments',
		icon: 'ChartColumnStacked',
		permissionCode: 'enrollments:read'
	},
	{
		key: 'menu',
		title: 'Menu',
		url: '/panel/menu',
		icon: 'Utensils',
		permissionCode: 'menu:read'
	},
	{
		key: 'moments',
		title: 'Moments',
		url: '/panel/moments',
		icon: 'Camera',
		permissionCode: 'moments:read'
	},
	{
		key: 'categories',
		title: 'Categories',
		url: '/panel/categories',
		icon: 'ChartColumnStacked',
		permissionCode: 'categories:read'
	},
	{
		key: 'products',
		title: 'Products',
		url: '/panel/products',
		icon: 'Package',
		permissionCode: 'products:read'
	},
	{
		key: 'outlets',
		title: 'Outlets',
		url: '/panel/outlets',
		icon: 'Store',
		permissionCode: 'outlets:read'
	},
	{
		key: 'outlet-map',
		title: 'Outlets Map',
		url: '/panel/outlet-map',
		icon: 'MapPinned',
		permissionCode: 'outlet_map:read'
	},
	{
		key: 'news',
		title: 'News',
		url: '/panel/news',
		icon: 'Newspaper',
		permissionCode: 'news:read'
	},
	{
		key: 'docs',
		title: 'Docs',
		url: '/docs',
		icon: 'FolderOpen',
		permissionCode: 'dashboard:read'
	},
	{
		key: 'settings',
		title: 'Settings',
		url: '/panel/settings',
		icon: 'SettingsIcon',
		permissionCode: 'settings:read'
	},
	{
		key: 'rbac',
		title: 'RBAC',
		url: '/panel/rbac',
		icon: 'ShieldCheck',
		permissionCode: 'rbac:read'
	}
];

export const PERMISSION_LABELS: Record<PermissionCode, string> = Object.entries(
	PANEL_RESOURCE_POLICY
).flatMap(([resource, actions]) =>
	actions.map((action) => [`${resource}:${action}`, `${resource} ${action}`])
).reduce(
	(acc, [code, label]) => ({
		...acc,
		[code]: label
	}),
	{} as Record<PermissionCode, string>
);
