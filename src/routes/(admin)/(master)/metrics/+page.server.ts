import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';

const MetricItemSchema = z.object({
	label: z.string().min(1, 'Label wajib diisi'),
	value: z.string().min(1, 'Value wajib diisi'),
	icon: z.string().min(1, 'Icon wajib diisi'),
	position: z.preprocess((v) => Number(v) || 0, z.number().int().min(0))
});

const BulkMetricsSchema = z.object({
	programId: z.string().min(1),
	metrics: z.array(MetricItemSchema)
});

export const load: PageServerLoad = async ({ url }) => {
	const programId = url.searchParams.get('programId') ?? '';

	const programOptions = await db
		.select({ value: program.id, label: program.title })
		.from(program)
		.orderBy(asc(program.title));

	let selectedProgram: { id: string; title: string } | null = null;
	let metrics: Array<{ label: string; value: string; icon: string; position: number }> = [];

	if (programId) {
		const [prog] = await db
			.select({ id: program.id, title: program.title })
			.from(program)
			.where(eq(program.id, programId))
			.limit(1);

		if (prog) {
			selectedProgram = prog;
			metrics = await ProgramService.getMetricsByProgramId(programId);
		}
	}

	return { programOptions, selectedProgram, metrics };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const programId = formData.get('programId')?.toString();
		const metricsJson = formData.get('metrics')?.toString();

		if (!programId) return fail(400, { message: 'Pilih program terlebih dahulu' });
		if (!metricsJson) return fail(400, { message: 'Data metrics kosong' });

		let parsed: unknown;
		try {
			parsed = JSON.parse(metricsJson);
		} catch {
			return fail(400, { message: 'Invalid JSON' });
		}

		const result = BulkMetricsSchema.safeParse({ programId, metrics: parsed });
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.saveMetrics(programId, result.data.metrics);
			return { success: true, message: 'Metrics berhasil disimpan' };
		} catch (err) {
			console.error('Save metrics error:', err);
			return fail(500, { message: 'Gagal menyimpan metrics' });
		}
	}
};
