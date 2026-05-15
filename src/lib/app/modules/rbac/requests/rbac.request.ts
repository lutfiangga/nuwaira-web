import { z } from 'zod';

export const UpdateDefaultRoleSchema = z.object({
	defaultRoleId: z.string().min(1, 'Role is required')
});

export const UpdateRolePermissionsSchema = z.object({
	roleId: z.string().min(1, 'Role is required'),
	permissionCodes: z.array(z.string()).default([])
});

export type UpdateDefaultRoleDTO = z.infer<typeof UpdateDefaultRoleSchema>;
export type UpdateRolePermissionsDTO = z.infer<typeof UpdateRolePermissionsSchema>;
