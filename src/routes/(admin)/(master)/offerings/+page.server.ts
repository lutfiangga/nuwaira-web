import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import { OfferingService } from '$lib/app/modules/program/services/offering.service';
import { CreateOfferingSchema, UpdateOfferingSchema } from '$lib/app/modules/program/requests/offering.request';

export const load: PageServerLoad = async ({ url }) => {
	const programId = url.searchParams.get('programId') ?? '';

	const programOptions = await db
		.select({ value: program.id, label: program.title })
		.from(program)
		.orderBy(asc(program.title));

	let selectedProgram: { id: string; title: string } | null = null;
	let offerings: unknown[] = [];

	if (programId) {
		const [prog] = await db
			.select({ id: program.id, title: program.title })
			.from(program)
			.where(eq(program.id, programId))
			.limit(1);

		if (prog) {
			selectedProgram = prog;
			offerings = await ProgramService.getOfferingsByProgramId(programId);
		}
	}

	return { programOptions, selectedProgram, offerings };
};

export const actions: Actions = {
	create: async ({ request, url }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);
		raw.programId = url.searchParams.get('programId') ?? '';
		const result = CreateOfferingSchema.safeParse(raw);
		if (!result.success) {
			return fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });
		}
		try {
			await OfferingService.createOffering(result.data);
			return { success: true, message: 'Offering berhasil ditambahkan' };
		} catch (e) {
			console.error('Create offering error:', e);
			return fail(500, { message: 'Gagal menambahkan offering' });
		}
	},

	update: async ({ request, url }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);
		raw.programId = url.searchParams.get('programId') ?? raw.programId ?? '';
		const result = UpdateOfferingSchema.safeParse(raw);
		if (!result.success) {
			return fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });
		}
		try {
			await OfferingService.updateOffering(result.data);
			return { success: true, message: 'Offering berhasil diupdate' };
		} catch (e) {
			console.error('Update offering error:', e);
			return fail(500, { message: 'Gagal mengupdate offering' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		try {
			await OfferingService.deleteOffering(id);
			return { success: true, message: 'Offering berhasil dihapus' };
		} catch (e) {
			console.error('Delete offering error:', e);
			return fail(500, { message: 'Gagal menghapus offering' });
		}
	}
};
