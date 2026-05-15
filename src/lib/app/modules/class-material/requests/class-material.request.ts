import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
	if (typeof value !== 'string') return value;
	const normalized = value.trim();
	return normalized === '' ? undefined : normalized;
};

const optionalText = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalPositiveInteger = z.preprocess((value) => {
	if (value === '' || value === null || value === undefined) return undefined;
	return Number(value);
}, z.number().int().min(1).optional());

const booleanFromInput = z.preprocess((value) => {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') return value.toLowerCase() === 'true';
	return false;
}, z.boolean());

const BaseClassMaterialSchema = z.object({
	classId: z.string().trim().min(1, 'Kelas wajib dipilih'),
	title: z.string().trim().min(1, 'Judul materi wajib diisi'),
	materialType: z.enum(['topic', 'practice', 'project', 'assessment']),
	orderNo: z.coerce.number().int().min(1, 'Urutan minimal 1'),
	durationMinutes: optionalPositiveInteger,
	learningOutcome: optionalText,
	resourceUrl: optionalText,
	isRequired: booleanFromInput
});

export const CreateClassMaterialSchema = BaseClassMaterialSchema;

export const UpdateClassMaterialSchema = BaseClassMaterialSchema.extend({
	id: z.string().min(1, 'ID wajib diisi')
});

export type CreateClassMaterialDTO = z.infer<typeof CreateClassMaterialSchema>;
export type UpdateClassMaterialDTO = z.infer<typeof UpdateClassMaterialSchema>;
