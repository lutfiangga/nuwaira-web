import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EnrollmentService } from '$lib/app/modules/enrollment/services/enrollment.service';
import { StudentService } from '$lib/app/modules/student/services/student.service';
import { BootcampClassService } from '$lib/app/modules/bootcamp-class/services/bootcamp-class.service';
import {
	CreateEnrollmentSchema,
	UpdateEnrollmentSchema
} from '$lib/app/modules/enrollment/requests/enrollment.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'enrollments', 'read');
	const [enrollments, students, classes] = await Promise.all([
		EnrollmentService.getAll(),
		StudentService.getAll(),
		BootcampClassService.getAll()
	]);
	return { enrollments, students, classes };
};

const actionHandlers = guardCrudActions('enrollments', {
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			studentId: formData.get('studentId'),
			classId: formData.get('classId'),
			status: formData.get('status'),
			paymentStatus: formData.get('paymentStatus'),
			finalScore: formData.get('finalScore'),
			notes: formData.get('notes')
		};

		const result = CreateEnrollmentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await EnrollmentService.create(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Siswa ini sudah terdaftar di kelas tersebut' });
			}
			console.error('Create Enrollment Error:', error);
			return fail(500, { message: 'Gagal membuat enrollment' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			studentId: formData.get('studentId'),
			classId: formData.get('classId'),
			status: formData.get('status'),
			paymentStatus: formData.get('paymentStatus'),
			finalScore: formData.get('finalScore'),
			notes: formData.get('notes')
		};

		const result = UpdateEnrollmentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await EnrollmentService.update(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Siswa ini sudah terdaftar di kelas tersebut' });
			}
			console.error('Update Enrollment Error:', error);
			return fail(500, { message: 'Gagal memperbarui enrollment' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await EnrollmentService.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Delete Enrollment Error:', error);
			return fail(500, { message: 'Gagal menghapus enrollment' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await EnrollmentService.bulkDelete(ids);
			return { success: true, count: ids.length };
		} catch (error) {
			console.error('Bulk Delete Enrollment Error:', error);
			return fail(500, { message: 'Gagal menghapus enrollment terpilih' });
		}
	}
});

export const actions: Actions = actionHandlers as Actions;
