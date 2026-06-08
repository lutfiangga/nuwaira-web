import { z } from 'zod';

const EmailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().trim().min(1, 'Email is required').email('Invalid email')
);

const PasswordSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().min(1, 'Password is required')
);

export const CreateUserSchema = z.object({
	email: EmailSchema,
	role: z.string().min(1, 'Role is required').optional().default('student'),
	password: PasswordSchema,
	photo: z.instanceof(File).optional()
});

export const UpdateUserSchema = z.object({
	id: z.string(),
	email: EmailSchema,
	role: z.string().min(1, 'Role is required').optional().default('student'),
	password: z.preprocess(
		(value) => (typeof value === 'string' && value.length > 0 ? value : null),
		z.string().optional().nullable()
	),
	photo: z.instanceof(File).optional(),
	photoDeleted: z.preprocess(
		(value) => value === 'true',
		z.boolean().optional()
	)
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
