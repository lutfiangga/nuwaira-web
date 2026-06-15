import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program, programIntro } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import { uploadCloudinaryImage } from '$lib/app/server/cloudinary';
import { z } from 'zod';

const SaveIntroSchema = z.object({
	programId: z.string().min(1),
	introEyebrow: z.string().min(1, 'Wajib diisi'),
	introTitle: z.string().min(1, 'Wajib diisi'),
	introImage: z.union([z.instanceof(File), z.string()]),
	introImageAlt: z.string().min(1, 'Wajib diisi'),
	deskripsi: z.preprocess(
		(v) => (typeof v === 'string' ? JSON.parse(v) : v),
		z.array(z.string()).default([])
	),
	learningBackground: z.preprocess(
		(v) => (typeof v === 'string' ? JSON.parse(v) : v),
		z.array(z.string()).default([])
	)
});

export const load: PageServerLoad = async ({ url }) => {
	const programId = url.searchParams.get('programId') ?? '';

	const programOptions = await db
		.select({ value: program.id, label: program.title })
		.from(program)
		.orderBy(asc(program.title));

	let selectedProgram: { id: string; title: string } | null = null;
	let intro: Record<string, unknown> | null = null;

	if (programId) {
		const [prog] = await db
			.select({ id: program.id, title: program.title })
			.from(program)
			.where(eq(program.id, programId))
			.limit(1);

		if (prog) {
			selectedProgram = prog;
			const [introRow] = await db
				.select()
				.from(programIntro)
				.where(eq(programIntro.programId, programId))
				.limit(1);
			if (introRow) intro = introRow;
		}
	}

	return { programOptions, selectedProgram, intro };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();

		// Handle image upload
		const imageFile = formData.get('introImage');
		if (imageFile instanceof File && imageFile.size > 0) {
			const result = await uploadCloudinaryImage(imageFile, 'programs');
			formData.set('introImage', result.url);
		} else {
			const existing = formData.get('introImage_existing');
			if (existing) formData.set('introImage', existing as string);
		}

		const result = SaveIntroSchema.safeParse(Object.fromEntries(formData));
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.upsertIntro({
				programId: result.data.programId,
				introEyebrow: result.data.introEyebrow,
				introTitle: result.data.introTitle,
				introImage: String(result.data.introImage),
				introImageAlt: result.data.introImageAlt,
				introImage_existing: [],
				introImage_deleted: [],
				deskripsi: result.data.deskripsi,
				learningBackground: result.data.learningBackground
			});
			return { success: true, message: 'Intro berhasil disimpan' };
		} catch (err) {
			console.error('Save intro error:', err);
			return fail(500, { message: 'Gagal menyimpan intro' });
		}
	}
};
