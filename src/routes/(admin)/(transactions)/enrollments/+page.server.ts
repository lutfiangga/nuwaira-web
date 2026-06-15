import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { program, programBatch, programOffering, student, user } from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import {
	CreateEnrollmentSchema,
	UpdateEnrollmentSchema
} from '$lib/app/modules/program/requests/enrollment.request';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const sort = url.searchParams.get('sort') ?? 'createdAt';
	const order = url.searchParams.get('order') ?? 'desc';

	const [enrollmentResult, studentOptions, offeringOptions, batchOptions] = await Promise.all([
		ProgramService.getAllEnrollments({ search, page, pageSize, sort, order }),
		db
			.select({
				value: student.id,
				label: student.fullName,
				email: user.email
			})
			.from(student)
			.innerJoin(user, eq(user.id, student.userId))
			.orderBy(asc(student.fullName)),
		db
			.select({
				value: programOffering.id,
				label: programOffering.name,
				programTitle: program.title
			})
			.from(programOffering)
			.innerJoin(program, eq(program.id, programOffering.programId))
			.orderBy(asc(program.title), asc(programOffering.name)),
		db
			.select({
				value: programBatch.id,
				label: programBatch.title,
				offeringName: programOffering.name,
				programTitle: program.title
			})
			.from(programBatch)
			.innerJoin(programOffering, eq(programOffering.id, programBatch.offeringId))
			.innerJoin(program, eq(program.id, programOffering.programId))
			.orderBy(asc(programBatch.title))
	]);

	return {
		enrollments: enrollmentResult.enrollments,
		pagination: { page, limit: pageSize, total: enrollmentResult.total },
		params: { search, sort, order },
		studentOptions: studentOptions.map((s) => ({
			value: s.value,
			label: `${s.label} (${s.email})`
		})),
		offeringOptions: offeringOptions.map((o) => ({
			value: o.value,
			label: `${o.programTitle} - ${o.label}`
		})),
		batchOptions: [
			{ value: '', label: 'None (Private)' },
			...batchOptions.map((b) => ({
				value: b.value,
				label: `${b.programTitle} - ${b.offeringName} - ${b.label}`
			}))
		]
	};
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = CreateEnrollmentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.createEnrollment(result.data);
			return { success: true };
		} catch (error: unknown) {
			console.error('Create Enrollment Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Student already enrolled in this batch/offering' });
			}
			return fail(500, {
				message: `Failed to create enrollment. ${getErrorMessage(error)}`
			});
		}
	},

	update: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = UpdateEnrollmentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.updateEnrollment(result.data);
			return { success: true };
		} catch (error: unknown) {
			console.error('Update Enrollment Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Student already enrolled in this batch/offering' });
			}
			return fail(500, { message: 'Failed to update enrollment' });
		}
	},

	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		try {
			await ProgramService.deleteEnrollment(id);
			return { success: true };
		} catch (e) {
			console.error('Delete Enrollment Error:', e);
			return fail(500, { message: 'Failed to delete enrollment' });
		}
	},

	bulkDelete: async (event) => {
		const formData = await event.request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await ProgramService.bulkDeleteEnrollments(ids);
			return { success: true, count: ids.length };
		} catch (e) {
			console.error('Bulk Delete Error:', e);
			return fail(500, { message: 'Failed to delete enrollments' });
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
