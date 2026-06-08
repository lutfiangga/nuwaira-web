import { db } from '$lib/app/database';
import {
	appSetting,
	bootcampClass,
	classMaterial,
	enrollment,
	panelModule,
	permission,
	role,
	rolePermission,
	routePermission,
	student,
	user
} from '$lib/app/database/schema';
import { APP_SETTING_KEYS, SUPERADMIN_ROLE_ID } from '$lib/app/modules/rbac/config/rbac.config';
import { hashPassword } from '$lib/app/server/auth';
import { eq, or } from 'drizzle-orm';

const ACTION_META = {
	read: { label: 'Read', verb: 'View', method: 'GET' },
	create: { label: 'Create', verb: 'Create', method: 'POST' },
	update: { label: 'Update', verb: 'Update', method: 'POST' },
	delete: { label: 'Delete', verb: 'Delete', method: 'POST' }
} as const;

type ActionKey = keyof typeof ACTION_META;

const ROLES: (typeof role.$inferInsert)[] = [
	{
		id: SUPERADMIN_ROLE_ID,
		name: 'Superadmin',
		description: 'Full access to every panel module and system setting.',
		isSystem: true
	}
];

const RESOURCES: Array<{
	key: string;
	label: string;
	subject: string;
	path: string;
	actions: ActionKey[];
}> = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		subject: 'dashboard overview and statistics',
		path: '/dashboard',
		actions: ['read']
	},
	{
		key: 'users',
		label: 'Users',
		subject: 'user records',
		path: '/users',
		actions: ['read', 'create', 'update', 'delete']
	},
	{
		key: 'students',
		label: 'Students',
		subject: 'student records',
		path: '/students',
		actions: ['read', 'create', 'update', 'delete']
	},
	{
		key: 'classes',
		label: 'Classes',
		subject: 'class records',
		path: '/classes',
		actions: ['read', 'create', 'update', 'delete']
	},
	{
		key: 'materials',
		label: 'Materials',
		subject: 'class material records',
		path: '/materials',
		actions: ['read', 'create', 'update', 'delete']
	},
	{
		key: 'enrollments',
		label: 'Enrollments',
		subject: 'enrollment records',
		path: '/enrollments',
		actions: ['read', 'create', 'update', 'delete']
	},
	{
		key: 'brand',
		label: 'Brand',
		subject: 'brand and SEO settings',
		path: '/brand',
		actions: ['read', 'update']
	},
	{
		key: 'settings',
		label: 'Settings',
		subject: 'profile settings',
		path: '/settings',
		actions: ['read', 'update']
	},
	{
		key: 'rbac',
		label: 'RBAC',
		subject: 'roles, permissions, panel modules, and route mappings',
		path: '/rbac',
		actions: ['read', 'create', 'update', 'delete']
	}
];

const PERMISSIONS: (typeof permission.$inferInsert)[] = RESOURCES.flatMap((resource) =>
	resource.actions.map((action) => ({
		code: `${resource.key}:${action}`,
		resource: resource.key,
		action,
		label: `${resource.label} ${ACTION_META[action].label}`,
		description: `${ACTION_META[action].verb} ${resource.subject}.`
	}))
);

const PANEL_MODULES: (typeof panelModule.$inferInsert)[] = [
	{
		id: 'panel-dashboard',
		moduleKey: 'dashboard',
		title: 'Dashboard',
		url: '/dashboard',
		icon: 'LayoutDashboard',
		menuPermissionCode: 'dashboard:read',
		sortOrder: 0,
		description: 'Panel overview and key metrics.'
	},
	{
		id: 'panel-users',
		moduleKey: 'users',
		title: 'Users',
		url: '/users',
		icon: 'Users',
		menuPermissionCode: 'users:read',
		sortOrder: 10,
		description: 'User account management.'
	},
	{
		id: 'panel-students',
		moduleKey: 'students',
		title: 'Students',
		url: '/students',
		icon: 'Users',
		menuPermissionCode: 'students:read',
		sortOrder: 20,
		description: 'Student data management.'
	},
	{
		id: 'panel-classes',
		moduleKey: 'classes',
		title: 'Classes',
		url: '/classes',
		icon: 'Package',
		menuPermissionCode: 'classes:read',
		sortOrder: 30,
		description: 'Bootcamp class management.'
	},
	{
		id: 'panel-materials',
		moduleKey: 'materials',
		title: 'Materials',
		url: '/materials',
		icon: 'FolderOpen',
		menuPermissionCode: 'materials:read',
		sortOrder: 40,
		description: 'Class material management.'
	},
	{
		id: 'panel-enrollments',
		moduleKey: 'enrollments',
		title: 'Enrollments',
		url: '/enrollments',
		icon: 'ChartColumnStacked',
		menuPermissionCode: 'enrollments:read',
		sortOrder: 50,
		description: 'Enrollment and payment tracking.'
	},
	{
		id: 'panel-brand',
		moduleKey: 'brand',
		title: 'Brand',
		url: '/brand',
		icon: 'Palette',
		menuPermissionCode: 'brand:read',
		sortOrder: 60,
		description: 'Brand identity and SEO settings.'
	},
	{
		id: 'panel-settings',
		moduleKey: 'settings',
		title: 'Settings',
		url: '/settings',
		icon: 'SettingsIcon',
		menuPermissionCode: 'settings:read',
		sortOrder: 70,
		description: 'User profile and account settings.'
	},
	{
		id: 'panel-rbac',
		moduleKey: 'rbac',
		title: 'RBAC',
		url: '/rbac',
		icon: 'ShieldCheck',
		menuPermissionCode: 'rbac:read',
		sortOrder: 80,
		description: 'Role, permission, panel module, and route access management.'
	}
];

const ROUTE_PERMISSIONS: (typeof routePermission.$inferInsert)[] = RESOURCES.flatMap((resource) =>
	resource.actions.map((action) => ({
		id: `route-${resource.key}-${action}`,
		routeKey: resource.key,
		operationKey: action,
		routePath: resource.path,
		method: ACTION_META[action].method,
		description:
			action === 'read'
				? `View ${resource.label.toLowerCase()} page.`
				: `${ACTION_META[action].verb} ${resource.subject}.`,
		permissionCode: `${resource.key}:${action}`
	}))
);

export class DatabaseSeeder {
	static async seedRoles() {
		await db.insert(role).values(ROLES).onConflictDoNothing({ target: role.id });
		return `Seeded/verified ${ROLES.length} roles.`;
	}

	static async seedPermissions() {
		await db
			.insert(permission)
			.values(PERMISSIONS)
			.onConflictDoNothing({ target: permission.code });
		return `Seeded/verified ${PERMISSIONS.length} permissions.`;
	}

	static async seedRolePermissions() {
		const superadminPermissions: (typeof rolePermission.$inferInsert)[] = PERMISSIONS.map(
			(entry) => ({
				roleId: SUPERADMIN_ROLE_ID,
				permissionCode: entry.code
			})
		);

		await db.insert(rolePermission).values(superadminPermissions).onConflictDoNothing();
		return `Seeded/verified ${superadminPermissions.length} role permissions.`;
	}

	static async seedAppSettings() {
		await db
			.insert(appSetting)
			.values({
				key: APP_SETTING_KEYS.defaultRegisterRole,
				value: SUPERADMIN_ROLE_ID
			})
			.onConflictDoNothing({ target: appSetting.key });

		return 'Seeded/verified RBAC app settings.';
	}

	static async seedPanelModules() {
		await db
			.insert(panelModule)
			.values(PANEL_MODULES)
			.onConflictDoNothing({ target: panelModule.moduleKey });

		return `Seeded/verified ${PANEL_MODULES.length} panel modules.`;
	}

	static async seedRoutePermissions() {
		await db
			.insert(routePermission)
			.values(ROUTE_PERMISSIONS)
			.onConflictDoNothing({
				target: [routePermission.routeKey, routePermission.operationKey]
			});

		return `Seeded/verified ${ROUTE_PERMISSIONS.length} route permissions.`;
	}

	static async seedUsers() {
		const existingSuperadmin = await db
			.select({ id: user.id })
			.from(user)
			.where(or(eq(user.username, 'superadmin'), eq(user.email, 'superadmin@nuwaira.id')))
			.limit(1);

		if (existingSuperadmin.length === 0) {
			const passwordHash = await hashPassword('password');
			const users: (typeof user.$inferInsert)[] = [
				{
					id: crypto.randomUUID(),
					username: 'superadmin',
					email: 'superadmin@nuwaira.id',
					roleId: SUPERADMIN_ROLE_ID,
					name: 'Super Admin',
					passwordHash
				}
			];
			await db.insert(user).values(users);
			return `Seeded ${users.length} users.`;
		}

		return 'Users already seeded.';
	}

	static async seedStudents() {
		const existingStudents = await db.select().from(student).limit(1);
		if (existingStudents.length > 0) {
			return 'Students already seeded.';
		}

		const students: (typeof student.$inferInsert)[] = [
			{
				id: crypto.randomUUID(),
				studentCode: 'STD-001',
				fullName: 'Ayu Pratama',
				email: 'ayu@student.id',
				phone: '081200000001',
				gender: 'female',
				track: 'personal',
				status: 'active'
			},
			{
				id: crypto.randomUUID(),
				studentCode: 'STD-002',
				fullName: 'Bima Saputra',
				email: 'bima@student.id',
				phone: '081200000002',
				gender: 'male',
				track: 'corporate',
				companyName: 'PT Contoh Teknologi',
				jobTitle: 'Software Engineer',
				status: 'active'
			}
		];

		await db.insert(student).values(students);
		return `Seeded ${students.length} students.`;
	}

	static async seedClasses() {
		const existingClasses = await db.select().from(bootcampClass).limit(1);
		if (existingClasses.length > 0) {
			return 'Classes already seeded.';
		}

		const now = new Date();
		const nextMonth = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
		const classes: (typeof bootcampClass.$inferInsert)[] = [
			{
				id: crypto.randomUUID(),
				code: 'CLS-TS-FUND-01',
				title: 'TypeScript Fundamentals',
				level: 'beginner',
				mode: 'online',
				mentorName: 'Lead Instructor',
				durationWeeks: 6,
				totalSessions: 12,
				price: 1500000,
				description: 'Foundational TypeScript for production web apps',
				startDate: now,
				endDate: nextMonth,
				status: 'published'
			},
			{
				id: crypto.randomUUID(),
				code: 'CLS-SK-ADV-01',
				title: 'SvelteKit Advanced Workshop',
				level: 'intermediate',
				mode: 'hybrid',
				mentorName: 'Lead Instructor',
				durationWeeks: 8,
				totalSessions: 16,
				price: 2500000,
				description: 'Production architecture, SSR patterns, and performance',
				startDate: now,
				endDate: nextMonth,
				status: 'published'
			}
		];

		await db.insert(bootcampClass).values(classes);
		return `Seeded ${classes.length} classes.`;
	}

	static async seedMaterials() {
		const existingMaterials = await db.select().from(classMaterial).limit(1);
		if (existingMaterials.length > 0) {
			return 'Materials already seeded.';
		}

		const classes = await db.select().from(bootcampClass);
		if (classes.length === 0) {
			return 'Skipped materials: no classes found.';
		}

		const materials: (typeof classMaterial.$inferInsert)[] = classes.flatMap(
			(klass, classIndex) => [
				{
					id: crypto.randomUUID(),
					classId: klass.id,
					title: 'Orientation and Roadmap',
					materialType: 'topic',
					orderNo: 1,
					durationMinutes: 45,
					learningOutcome: 'Understand course structure and outcomes',
					resourceUrl: `https://example.local/materials/${classIndex + 1}/orientation`,
					isRequired: true
				},
				{
					id: crypto.randomUUID(),
					classId: klass.id,
					title: 'Hands-on Assignment 1',
					materialType: 'assignment',
					orderNo: 2,
					durationMinutes: 90,
					learningOutcome: 'Apply first module concepts in practice',
					resourceUrl: `https://example.local/materials/${classIndex + 1}/assignment-1`,
					isRequired: true
				}
			]
		);

		await db.insert(classMaterial).values(materials);
		return `Seeded ${materials.length} class materials.`;
	}

	static async seedEnrollments() {
		const existingEnrollments = await db.select().from(enrollment).limit(1);
		if (existingEnrollments.length > 0) {
			return 'Enrollments already seeded.';
		}

		const [students, classes] = await Promise.all([
			db.select().from(student),
			db.select().from(bootcampClass)
		]);

		if (students.length === 0 || classes.length === 0) {
			return 'Skipped enrollments: students/classes not ready.';
		}

		const enrollments: (typeof enrollment.$inferInsert)[] = students.map((entry, index) => ({
			id: crypto.randomUUID(),
			studentId: entry.id,
			classId: classes[index % classes.length].id,
			status: 'active',
			paymentStatus: index % 2 === 0 ? 'paid' : 'pending',
			finalScore: null,
			notes: null
		}));

		await db.insert(enrollment).values(enrollments);
		return `Seeded ${enrollments.length} enrollments.`;
	}

	static async run() {
		const roleMsg = await this.seedRoles();
		const permissionMsg = await this.seedPermissions();
		const rolePermissionMsg = await this.seedRolePermissions();
		const appSettingMsg = await this.seedAppSettings();
		const panelModuleMsg = await this.seedPanelModules();
		const routePermissionMsg = await this.seedRoutePermissions();
		const userMsg = await this.seedUsers();
		const studentMsg = await this.seedStudents();
		const classMsg = await this.seedClasses();
		const materialMsg = await this.seedMaterials();
		const enrollmentMsg = await this.seedEnrollments();

		return {
			message: 'Seeding complete',
			roles: roleMsg,
			permissions: permissionMsg,
			rolePermissions: rolePermissionMsg,
			appSettings: appSettingMsg,
			panelModules: panelModuleMsg,
			routePermissions: routePermissionMsg,
			users: userMsg,
			students: studentMsg,
			classes: classMsg,
			materials: materialMsg,
			enrollments: enrollmentMsg
		};
	}
}
