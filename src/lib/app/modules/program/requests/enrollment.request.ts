import { z } from 'zod';

export const CreateEnrollmentSchema = z.object({
	studentId: z.string().min(1, 'Siswa wajib dipilih'),
	offeringId: z.string().min(1, 'Offering wajib dipilih'),
	batchId: z.preprocess(
		(value) => (value && value !== '' ? value : null),
		z.string().nullable().optional()
	),
	motivation: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Motivasi wajib diisi')
	),
	referralSource: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Referral source wajib diisi')
	),
	hasProgrammingBasics: z.preprocess(
		(value) => value === 'true' || value === true,
		z.boolean().default(false)
	),
	usesAiTools: z.preprocess(
		(value) => value === 'true' || value === true,
		z.boolean().default(false)
	),
	status: z.enum(['pending', 'accepted', 'rejected', 'cancelled', 'completed']).default('pending')
});

export const UpdateEnrollmentSchema = CreateEnrollmentSchema.extend({
	id: z.string()
});

export type CreateEnrollmentDTO = z.infer<typeof CreateEnrollmentSchema>;
export type UpdateEnrollmentDTO = z.infer<typeof UpdateEnrollmentSchema>;
