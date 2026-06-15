import { z } from 'zod';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseDays(value: unknown) {
	if (Array.isArray(value)) return value;
	if (typeof value !== 'string') return [];

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export const CreateBatchSchema = z
	.object({
		offeringId: z.string().min(1, 'Offering wajib dipilih'),
		slug: z.preprocess(
			(value) => (typeof value === 'string' ? value.trim() : ''),
			z.string().min(1, 'Slug wajib diisi')
		),
		title: z.preprocess(
			(value) => (typeof value === 'string' ? value.trim() : ''),
			z.string().min(1, 'Title wajib diisi')
		),
		registrationOpenAt: z.preprocess(
			(value) => (value ? String(value) : null),
			z.string().nullable().optional()
		),
		registrationCloseAt: z.preprocess(
			(value) => (value ? String(value) : null),
			z.string().nullable().optional()
		),
		startDate: z.preprocess(
			(value) => (value ? String(value) : null),
			z.string().nullable().optional()
		),
		endDate: z.preprocess(
			(value) => (value ? String(value) : null),
			z.string().nullable().optional()
		),
		capacity: z.preprocess((value) => {
			if (!value || value === '') return null;
			const n = Number(value);
			return Number.isNaN(n) ? null : n;
		}, z.number().int().positive().nullable().optional()),
		isOpen: z.preprocess((value) => value === 'true' || value === true, z.boolean().default(false)),
		locationType: z.preprocess(
			(value) => (typeof value === 'string' ? value.trim() : 'onsite'),
			z.enum(['remote', 'onsite']).default('onsite')
		),
		location: z.preprocess(
			(value) => (typeof value === 'string' && value.trim() ? value.trim() : null),
			z.string().nullable().optional()
		),
		days: z.preprocess(
			parseDays,
			z.array(z.coerce.number().int().min(0).max(6)).min(1, 'Pilih minimal satu hari')
		),
		startTime: z.string().regex(TIME_PATTERN, 'Jam mulai wajib diisi'),
		endTime: z.string().regex(TIME_PATTERN, 'Jam selesai wajib diisi')
	})
	.refine((data) => data.startTime < data.endTime, {
		message: 'Jam selesai harus setelah jam mulai',
		path: ['endTime']
	});

export const UpdateBatchSchema = CreateBatchSchema.safeExtend({
	id: z.string()
});

export type CreateBatchDTO = z.infer<typeof CreateBatchSchema>;
export type UpdateBatchDTO = z.infer<typeof UpdateBatchSchema>;
