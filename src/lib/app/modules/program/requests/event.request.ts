import { z } from 'zod';

export const CreateEventSchema = z.object({
	slug: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Slug wajib diisi')
	),
	title: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Title wajib diisi')
	),
	summary: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Summary wajib diisi')
	),
	startAt: z.preprocess(
		(value) => (value ? String(value) : null),
		z.string().nullable().optional()
	),
	endAt: z.preprocess(
		(value) => (value ? String(value) : null),
		z.string().nullable().optional()
	),
	registrationUrl: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().optional().default('')
	),
	isActive: z.preprocess(
		(value) => value === 'true' || value === true,
		z.boolean().default(true)
	)
});

export const UpdateEventSchema = CreateEventSchema.extend({
	id: z.string()
});

export type CreateEventDTO = z.infer<typeof CreateEventSchema>;
export type UpdateEventDTO = z.infer<typeof UpdateEventSchema>;
