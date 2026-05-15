import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
	if (typeof value !== 'string') return value;
	const normalized = value.trim();
	return normalized === '' ? undefined : normalized;
};

const optionalText = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalDateString = z.preprocess(
	emptyStringToUndefined,
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal wajib YYYY-MM-DD')
		.optional()
);

const BaseBootcampClassSchema = z.object({
	code: z.string().trim().min(1, 'Kode kelas wajib diisi'),
	title: z.string().trim().min(1, 'Nama kelas wajib diisi'),
	level: z.enum(['beginner', 'intermediate', 'advanced']),
	mode: z.enum(['online', 'offline', 'hybrid']),
	mentorName: optionalText,
	durationWeeks: z.coerce.number().int().min(1, 'Durasi minimal 1 minggu'),
	totalSessions: z.coerce.number().int().min(1, 'Total sesi minimal 1'),
	price: z.coerce.number().int().min(0, 'Harga tidak boleh negatif'),
	description: optionalText,
	startDate: optionalDateString,
	endDate: optionalDateString,
	status: z.enum(['draft', 'open', 'running', 'finished', 'archived'])
});

export const CreateBootcampClassSchema = BaseBootcampClassSchema;

export const UpdateBootcampClassSchema = BaseBootcampClassSchema.extend({
	id: z.string().min(1, 'ID wajib diisi')
});

export type CreateBootcampClassDTO = z.infer<typeof CreateBootcampClassSchema>;
export type UpdateBootcampClassDTO = z.infer<typeof UpdateBootcampClassSchema>;
