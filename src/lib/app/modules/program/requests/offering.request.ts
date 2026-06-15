import { z } from 'zod';

export const CreateOfferingSchema = z.object({
	programId: z.string(),
	slug: z.preprocess((v) => (typeof v === 'string' ? v.trim() : ''), z.string().min(1)),
	type: z.enum(['batch', 'private']),
	name: z.preprocess((v) => (typeof v === 'string' ? v.trim() : ''), z.string().min(1)),
	title: z.preprocess((v) => (typeof v === 'string' ? v.trim() : ''), z.string().min(1)),
	priceAmount: z.preprocess((v) => Number(v), z.number().min(0)),
	badge: z.preprocess((v) => (typeof v === 'string' ? v.trim() : ''), z.string().optional()),
	benefits: z.preprocess(
		(v) =>
			typeof v === 'string'
				? v
						.split('\n')
						.map((s) => s.trim())
						.filter(Boolean)
				: [],
		z.array(z.string())
	)
});

export const UpdateOfferingSchema = CreateOfferingSchema.extend({
	id: z.string()
});

export type CreateOfferingDTO = z.infer<typeof CreateOfferingSchema>;
export type UpdateOfferingDTO = z.infer<typeof UpdateOfferingSchema>;
