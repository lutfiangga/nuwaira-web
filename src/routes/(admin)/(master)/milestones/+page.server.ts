import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import { getAllThesvgIcons } from '$lib/thesvg-icons';

const MilestoneItemSchema = z.object({
	title: z.string().min(1, 'Title wajib diisi'),
	weeks: z.string().min(1, 'Weeks wajib diisi'),
	description: z.string().min(1, 'Description wajib diisi'),
	output: z.string().min(1, 'Output wajib diisi'),
	icon: z.string().default('foundation'),
	technologyIds: z.array(z.string()).default([])
});

const BulkMilestonesSchema = z.object({
	milestones: z.array(MilestoneItemSchema)
});

export const load: PageServerLoad = async ({ url }) => {
	const programId = url.searchParams.get('programId') ?? '';

	const programOptions = await db
		.select({ value: program.id, label: program.title })
		.from(program)
		.orderBy(asc(program.title));

	const technologyOptions = getAllThesvgIcons();

	let milestones: unknown[] = [];
	let selectedProgram: { id: string; title: string } | null = null;

	if (programId) {
		const [prog] = await db
			.select({ id: program.id, title: program.title })
			.from(program)
			.where(eq(program.id, programId))
			.limit(1);

		if (prog) {
			selectedProgram = prog;
			milestones = await ProgramService.getMilestonesByProgramId(programId);
		}
	}

	return {
		programOptions,
		selectedProgram,
		milestones,
		technologyOptions
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const programId = formData.get('programId')?.toString();
		const milestonesJson = formData.get('milestones')?.toString();

		if (!programId) return fail(400, { message: 'Pilih program terlebih dahulu' });
		if (!milestonesJson) return fail(400, { message: 'Data milestones kosong' });

		let parsed: unknown;
		try {
			parsed = JSON.parse(milestonesJson);
		} catch {
			return fail(400, { message: 'Invalid JSON' });
		}

		const result = BulkMilestonesSchema.safeParse(parsed);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.saveMilestones(programId, result.data.milestones);
			return { success: true, message: 'Milestones berhasil disimpan' };
		} catch (err) {
			console.error('Save milestones error:', err);
			return fail(500, { message: 'Gagal menyimpan milestones' });
		}
	}
};
