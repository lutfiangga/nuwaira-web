import { z } from 'zod';

const requiredString = z.preprocess(
	(value) => (typeof value === 'string' ? value.trim() : ''),
	z.string().min(1, 'Wajib diisi')
);

const fileOrString = z.union([z.instanceof(File), z.string()]);
const fileOrStringOptional = z.union([z.instanceof(File), z.string()]).optional();

export const CreateProgramSchema = z.object({
	title: requiredString,
	slug: requiredString,
	summary: requiredString,
	eyebrow: requiredString,
	heroImage: fileOrString,
	heroImageAlt: requiredString,
	status: z.enum(['draft', 'published', 'archived']).default('draft')
});

export const UpdateProgramSchema = z.object({
	id: z.string(),
	title: requiredString,
	slug: requiredString,
	summary: requiredString,
	eyebrow: requiredString,
	heroImage: fileOrStringOptional,
	heroImageAlt: requiredString,
	status: z.enum(['draft', 'published', 'archived']).default('draft'),
	heroImage_existing: z.preprocess((v) => (Array.isArray(v) ? v : v ? [v] : []), z.array(z.string())).optional(),
	heroImage_deleted: z.preprocess((v) => (Array.isArray(v) ? v : v ? [v] : []), z.array(z.string())).optional()
});

export type CreateProgramDTO = z.infer<typeof CreateProgramSchema>;
export type UpdateProgramDTO = z.infer<typeof UpdateProgramSchema>;
