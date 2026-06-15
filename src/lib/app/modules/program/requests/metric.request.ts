import { z } from 'zod';

const requiredString = z.preprocess(
	(value) => (typeof value === 'string' ? value.trim() : ''),
	z.string().min(1, 'Wajib diisi')
);

export const CreateMetricSchema = z.object({
	programId: z.string(),
	label: requiredString,
	value: requiredString,
	icon: requiredString,
	position: z.preprocess((v) => Number(v), z.number().int().min(0))
});

export const UpdateMetricSchema = CreateMetricSchema.extend({
	id: z.string()
});

export type CreateMetricDTO = z.infer<typeof CreateMetricSchema>;
export type UpdateMetricDTO = z.infer<typeof UpdateMetricSchema>;
