import { z } from 'zod';

const ICON_OPTIONS = ['foundation', 'logic', 'professional', 'capstone'] as const;

export const CreateMilestoneSchema = z.object({
	programId: z.string().min(1, 'Program wajib dipilih'),
	title: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Title wajib diisi')
	),
	weeks: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Weeks wajib diisi')
	),
	description: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Description wajib diisi')
	),
	output: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Output wajib diisi')
	),
	icon: z.enum(ICON_OPTIONS).default('foundation'),
	position: z.preprocess(
		(value) => {
			if (!value || value === '') return 1;
			const n = Number(value);
			return Number.isNaN(n) ? 1 : n;
		},
		z.number().int().positive().default(1)
	),
	technologyIds: z.preprocess(
		(value) => {
			if (typeof value === 'string') {
				try { return JSON.parse(value); } catch { return []; }
			}
			return Array.isArray(value) ? value : [];
		},
		z.array(z.string()).default([])
	)
});

export const UpdateMilestoneSchema = CreateMilestoneSchema.extend({
	id: z.string()
});

export type CreateMilestoneDTO = z.infer<typeof CreateMilestoneSchema>;
export type UpdateMilestoneDTO = z.infer<typeof UpdateMilestoneSchema>;
