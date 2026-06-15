import { z } from 'zod';

const requiredString = z.preprocess(
	(value) => (typeof value === 'string' ? value.trim() : ''),
	z.string().min(1, 'Wajib diisi')
);

const fileOrString = z.union([z.instanceof(File), z.string()]);
const fileOrStringOptional = z.union([z.instanceof(File), z.string()]).optional();

export const UpsertIntroSchema = z.object({
	programId: z.string(),
	introEyebrow: requiredString,
	introTitle: requiredString,
	introImage: fileOrString,
	introImageAlt: requiredString,
	introImage_existing: z.preprocess((v) => (Array.isArray(v) ? v : v ? [v] : []), z.array(z.string())).optional(),
	introImage_deleted: z.preprocess((v) => (Array.isArray(v) ? v : v ? [v] : []), z.array(z.string())).optional(),
	deskripsi: z.preprocess(
		(v) => (typeof v === 'string' ? JSON.parse(v) : v),
		z.array(z.string()).default([])
	),
	learningBackground: z.preprocess(
		(v) => (typeof v === 'string' ? JSON.parse(v) : v),
		z.array(z.string()).default([])
	)
});

export type UpsertIntroDTO = z.infer<typeof UpsertIntroSchema>;
