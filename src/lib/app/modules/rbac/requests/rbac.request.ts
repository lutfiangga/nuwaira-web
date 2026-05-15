import { z } from 'zod';

const booleanFromForm = z.preprocess(
	(value) => value === true || value === 'true' || value === 'on' || value === '1',
	z.boolean()
);

const nullableText = z.preprocess((value) => {
	if (typeof value !== 'string') {
		return null;
	}

	const normalized = value.trim();
	return normalized.length > 0 ? normalized : null;
}, z.string().nullable());

const roleIdSchema = z
	.string()
	.min(2, 'Role id is required')
	.max(100, 'Role id is too long')
	.regex(/^[a-z0-9_-]+$/, 'Role id must use lowercase letters, numbers, underscore, dash');

const permissionCodeSchema = z
	.string()
	.min(3, 'Permission code is required')
	.max(150, 'Permission code is too long')
	.regex(/^[a-z0-9:_-]+$/, 'Permission code format is invalid');

export const UpdateDefaultRoleSchema = z.object({
	defaultRoleId: roleIdSchema
});

export const UpdateRolePermissionsSchema = z.object({
	roleId: roleIdSchema,
	permissionCodes: z.array(permissionCodeSchema).default([])
});

export const CreateRoleSchema = z.object({
	id: roleIdSchema,
	name: z.string().min(2, 'Role name is required').max(100, 'Role name is too long'),
	description: nullableText.optional().default(null)
});

export const UpdateRoleSchema = z.object({
	id: roleIdSchema,
	name: z.string().min(2, 'Role name is required').max(100, 'Role name is too long'),
	description: nullableText.optional().default(null)
});

export const DeleteRoleSchema = z.object({
	id: roleIdSchema
});

export const CreatePermissionSchema = z.object({
	code: permissionCodeSchema,
	resource: z.string().min(1, 'Resource is required').max(100, 'Resource is too long'),
	action: z.string().min(1, 'Action is required').max(100, 'Action is too long'),
	label: z.string().min(1, 'Label is required').max(120, 'Label is too long'),
	description: nullableText.optional().default(null)
});

export const UpdatePermissionSchema = z.object({
	code: permissionCodeSchema,
	resource: z.string().min(1, 'Resource is required').max(100, 'Resource is too long'),
	action: z.string().min(1, 'Action is required').max(100, 'Action is too long'),
	label: z.string().min(1, 'Label is required').max(120, 'Label is too long'),
	description: nullableText.optional().default(null)
});

export const DeletePermissionSchema = z.object({
	code: permissionCodeSchema
});

export const CreatePanelModuleSchema = z.object({
	moduleKey: z
		.string()
		.min(2, 'Module key is required')
		.max(100, 'Module key is too long')
		.regex(/^[a-z0-9._-]+$/, 'Module key format is invalid'),
	title: z.string().min(2, 'Title is required').max(100, 'Title is too long'),
	url: z.string().min(2, 'URL is required').max(255, 'URL is too long'),
	icon: z.string().min(1, 'Icon is required').max(80, 'Icon is too long').optional().default('LayoutDashboard'),
	menuPermissionCode: nullableText.optional().default(null),
	sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
	description: nullableText.optional().default(null),
	isVisible: booleanFromForm,
	isActive: booleanFromForm
});

export const UpdatePanelModuleSchema = z.object({
	id: z.string().min(1, 'Module id is required'),
	moduleKey: z
		.string()
		.min(2, 'Module key is required')
		.max(100, 'Module key is too long')
		.regex(/^[a-z0-9._-]+$/, 'Module key format is invalid'),
	title: z.string().min(2, 'Title is required').max(100, 'Title is too long'),
	url: z.string().min(2, 'URL is required').max(255, 'URL is too long'),
	icon: z.string().min(1, 'Icon is required').max(80, 'Icon is too long').optional().default('LayoutDashboard'),
	menuPermissionCode: nullableText.optional().default(null),
	sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
	description: nullableText.optional().default(null),
	isVisible: booleanFromForm,
	isActive: booleanFromForm
});

export const DeletePanelModuleSchema = z.object({
	id: z.string().min(1, 'Module id is required')
});

export const CreateRoutePermissionSchema = z.object({
	routeKey: z
		.string()
		.min(2, 'Route key is required')
		.max(120, 'Route key is too long')
		.regex(/^[a-z0-9._:-]+$/, 'Route key format is invalid'),
	operationKey: z
		.string()
		.min(2, 'Operation key is required')
		.max(120, 'Operation key is too long')
		.regex(/^[a-z0-9._:-]+$/, 'Operation key format is invalid'),
	routePath: nullableText.optional().default(null),
	method: nullableText.optional().default(null),
	description: nullableText.optional().default(null),
	permissionCode: permissionCodeSchema,
	isActive: booleanFromForm
});

export const UpdateRoutePermissionSchema = z.object({
	id: z.string().min(1, 'Route permission id is required'),
	routeKey: z
		.string()
		.min(2, 'Route key is required')
		.max(120, 'Route key is too long')
		.regex(/^[a-z0-9._:-]+$/, 'Route key format is invalid'),
	operationKey: z
		.string()
		.min(2, 'Operation key is required')
		.max(120, 'Operation key is too long')
		.regex(/^[a-z0-9._:-]+$/, 'Operation key format is invalid'),
	routePath: nullableText.optional().default(null),
	method: nullableText.optional().default(null),
	description: nullableText.optional().default(null),
	permissionCode: permissionCodeSchema,
	isActive: booleanFromForm
});

export const DeleteRoutePermissionSchema = z.object({
	id: z.string().min(1, 'Route permission id is required')
});

export type UpdateDefaultRoleDTO = z.infer<typeof UpdateDefaultRoleSchema>;
export type UpdateRolePermissionsDTO = z.infer<typeof UpdateRolePermissionsSchema>;
export type CreateRoleDTO = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof UpdateRoleSchema>;
export type DeleteRoleDTO = z.infer<typeof DeleteRoleSchema>;
export type CreatePermissionDTO = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionDTO = z.infer<typeof UpdatePermissionSchema>;
export type DeletePermissionDTO = z.infer<typeof DeletePermissionSchema>;
export type CreatePanelModuleDTO = z.infer<typeof CreatePanelModuleSchema>;
export type UpdatePanelModuleDTO = z.infer<typeof UpdatePanelModuleSchema>;
export type DeletePanelModuleDTO = z.infer<typeof DeletePanelModuleSchema>;
export type CreateRoutePermissionDTO = z.infer<typeof CreateRoutePermissionSchema>;
export type UpdateRoutePermissionDTO = z.infer<typeof UpdateRoutePermissionSchema>;
export type DeleteRoutePermissionDTO = z.infer<typeof DeleteRoutePermissionSchema>;
