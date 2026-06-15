import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program, programBatch, programOffering } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import {
	CreateBatchSchema,
	UpdateBatchSchema
} from '$lib/app/modules/program/requests/batch.request';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const sort = url.searchParams.get('sort') ?? 'title';
	const order = url.searchParams.get('order') ?? 'asc';

	const [batchResult, offeringOptions] = await Promise.all([
		ProgramService.getAllBatches({ search, page, pageSize, sort, order }),
		db
			.select({
				value: programOffering.id,
				label: programOffering.name,
				programTitle: program.title
			})
			.from(programOffering)
			.innerJoin(program, eq(program.id, programOffering.programId))
			.where(eq(programOffering.type, 'batch'))
			.orderBy(asc(program.title), asc(programOffering.name))
	]);

	return {
		batches: batchResult.batches,
		pagination: { page, limit: pageSize, total: batchResult.total },
		params: { search, sort, order },
		offeringOptions: offeringOptions.map((o) => ({
			value: o.value,
			label: `${o.programTitle} - ${o.label}`
		}))
	};
};

export const actions: Actions = {
	toggle: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const isOpen = form.get('isOpen') === 'true';
		if (typeof id !== 'string') return { success: false };
		await db
			.update(programBatch)
			.set({ isOpen, updatedAt: new Date() })
			.where(eq(programBatch.id, id));
		return { success: true };
	},

	create: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = CreateBatchSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.createBatch(result.data);
			return { success: true };
		} catch (error: unknown) {
			console.error('Create Batch Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists for this offering' });
			}
			return fail(500, { message: `Failed to create batch. ${getErrorMessage(error)}` });
		}
	},

	update: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = UpdateBatchSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.updateBatch(result.data);
			return { success: true };
		} catch (error: unknown) {
			console.error('Update Batch Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists for this offering' });
			}
			return fail(500, { message: 'Failed to update batch' });
		}
	},

	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		try {
			await ProgramService.deleteBatch(id);
			return { success: true };
		} catch (e) {
			console.error('Delete Batch Error:', e);
			return fail(500, { message: 'Failed to delete batch' });
		}
	},

	bulkDelete: async (event) => {
		const formData = await event.request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await ProgramService.bulkDeleteBatches(ids);
			return { success: true, count: ids.length };
		} catch (e) {
			console.error('Bulk Delete Error:', e);
			return fail(500, { message: 'Failed to delete batches' });
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
