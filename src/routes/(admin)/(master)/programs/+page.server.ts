import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import {
	CreateProgramSchema,
	UpdateProgramSchema
} from '$lib/app/modules/program/requests/program.request';
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

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const sort = url.searchParams.get('sort') ?? 'title';
	const order = url.searchParams.get('order') ?? 'asc';

	const { programs, total } = await ProgramService.getAllPrograms({
		search,
		page,
		pageSize,
		sort,
		order
	});

	return {
		programs,
		pagination: { page, limit: pageSize, total },
		params: { search, sort, order }
	};
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();

		const heroImage = await resolveImage(formData, 'heroImage');
		if (heroImage) formData.set('heroImage', heroImage);

		const rawData = Object.fromEntries(formData);
		const result = CreateProgramSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.createProgram(result.data);
			return { success: true };
		} catch (error: unknown) {
			console.error('Create Program Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists' });
			}
			return fail(500, { message: `Failed to create program. ${getErrorMessage(error)}` });
		}
	},

	update: async (event) => {
		const formData = await event.request.formData();

		const heroImage = await resolveImage(formData, 'heroImage');
		if (heroImage) formData.set('heroImage', heroImage);

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
			return { success: true };
		} catch (error: unknown) {
			console.error('Update Program Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists' });
			}
			return fail(500, { message: 'Failed to update program' });
		}
	},

	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		try {
			await ProgramService.deleteProgram(id);
			return { success: true };
		} catch (e) {
			console.error('Delete Program Error:', e);
			return fail(500, { message: 'Failed to delete program' });
		}
	},

	bulkDelete: async (event) => {
		const formData = await event.request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await ProgramService.bulkDeletePrograms(ids);
			return { success: true, count: ids.length };
		} catch (e) {
			console.error('Bulk Delete Error:', e);
			return fail(500, { message: 'Failed to delete programs' });
		}
	}
};

function getErrorCode(error: unknown) {
	return error && typeof error === 'object' && 'code' in error
		? String((error as { code?: unknown }).code ?? '')
		: '';
}

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : '';
}
