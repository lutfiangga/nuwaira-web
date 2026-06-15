import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import { getEditProgramFormSchema } from '$lib/app/modules/program/forms/program.form';
import { UpdateProgramSchema } from '$lib/app/modules/program/requests/program.request';
import { uploadCloudinaryImage } from '$lib/app/server/cloudinary';

const PROGRAM_IMAGE_FOLDER = 'programs';

async function resolveImage(formData: FormData, field: string): Promise<string | undefined> {
	const file = formData.get(field);
	if (file instanceof File && file.size > 0) {
		const result = await uploadCloudinaryImage(file, PROGRAM_IMAGE_FOLDER);
		return result.url;
	}
	const existing = formData.getAll(`${field}_existing`);
	if (existing.length > 0) return existing[existing.length - 1] as string;
	return undefined;
}

export const load: PageServerLoad = async ({ params }) => {
	const programDetail = await ProgramService.getProgramDetail(params.id);

	if (!programDetail) {
		throw new Error('Program tidak ditemukan');
	}

	return { program: programDetail };
};

export const actions: Actions = {
	update: async (event) => {
		const formData = await event.request.formData();

		const heroImage = await resolveImage(formData, 'heroImage');
		if (heroImage) formData.set('heroImage', heroImage);

		formData.set('id', event.params.id);
		const rawData = Object.fromEntries(formData);

		const result = UpdateProgramSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.updateProgram(result.data);
			return { success: true, message: 'Program berhasil diupdate' };
		} catch (e: unknown) {
			console.error('Update Program Error:', e);
			return fail(500, { message: 'Failed to update program' });
		}
	}
};
