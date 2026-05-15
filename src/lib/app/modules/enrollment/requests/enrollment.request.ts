import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
	if (typeof value !== 'string') return value;
	const normalized = value.trim();
	return normalized === '' ? undefined : normalized;
};

const optionalText = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalScore = z.preprocess((value) => {
	if (value === '' || value === null || value === undefined) return undefined;
	return Number(value);
}, z.number().int().min(0).max(100).optional());

const BaseEnrollmentSchema = z.object({
	studentId: z.string().trim().min(1, 'Siswa wajib dipilih'),
	classId: z.string().trim().min(1, 'Kelas wajib dipilih'),
	status: z.enum(['active', 'completed', 'cancelled', 'dropped']),
	paymentStatus: z.enum(['pending', 'partial', 'paid', 'refunded']),
	finalScore: optionalScore,
	notes: optionalText
});

export const CreateEnrollmentSchema = BaseEnrollmentSchema;

export const UpdateEnrollmentSchema = BaseEnrollmentSchema.extend({
	id: z.string().min(1, 'ID wajib diisi')
});

export type CreateEnrollmentDTO = z.infer<typeof CreateEnrollmentSchema>;
export type UpdateEnrollmentDTO = z.infer<typeof UpdateEnrollmentSchema>;
