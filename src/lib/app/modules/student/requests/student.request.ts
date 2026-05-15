import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
	if (typeof value !== 'string') return value;
	const normalized = value.trim();
	return normalized === '' ? undefined : normalized;
};

const optionalText = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalEmail = z.preprocess(
	emptyStringToUndefined,
	z.string().email('Format email tidak valid').optional()
);

const BaseStudentSchema = z
	.object({
		studentCode: z.string().trim().min(1, 'Student code wajib diisi'),
		fullName: z.string().trim().min(1, 'Nama siswa wajib diisi'),
		email: z.string().trim().email('Format email tidak valid'),
		phone: optionalText,
		gender: z.enum(['male', 'female', 'other']),
		track: z.enum(['personal', 'business']),
		companyName: optionalText,
		jobTitle: optionalText,
		billingContact: optionalText,
		billingEmail: optionalEmail,
		status: z.enum(['active', 'inactive', 'alumni']),
		notes: optionalText
	})
	.superRefine((data, ctx) => {
		if (data.track === 'business' && !data.companyName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['companyName'],
				message: 'Company name wajib diisi untuk track business'
			});
		}
	});

export const CreateStudentSchema = BaseStudentSchema;

export const UpdateStudentSchema = BaseStudentSchema.safeExtend({
	id: z.string().min(1, 'ID wajib diisi')
});

export type CreateStudentDTO = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentDTO = z.infer<typeof UpdateStudentSchema>;
