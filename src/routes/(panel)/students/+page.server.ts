import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { StudentService } from '$lib/app/modules/student/services/student.service';
import {
	CreateStudentSchema,
	UpdateStudentSchema
} from '$lib/app/modules/student/requests/student.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'students', 'read');
	const students = await StudentService.getAll();
	return { students };
};

const actionHandlers = guardCrudActions('students', {
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			studentCode: formData.get('studentCode'),
			fullName: formData.get('fullName'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			gender: formData.get('gender'),
			track: formData.get('track'),
			companyName: formData.get('companyName'),
			jobTitle: formData.get('jobTitle'),
			billingContact: formData.get('billingContact'),
			billingEmail: formData.get('billingEmail'),
			status: formData.get('status'),
			notes: formData.get('notes')
		};

		const result = CreateStudentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await StudentService.create(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Student code atau email sudah digunakan' });
			}
			console.error('Create Student Error:', error);
			return fail(500, { message: 'Gagal membuat data siswa' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			studentCode: formData.get('studentCode'),
			fullName: formData.get('fullName'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			gender: formData.get('gender'),
			track: formData.get('track'),
			companyName: formData.get('companyName'),
			jobTitle: formData.get('jobTitle'),
			billingContact: formData.get('billingContact'),
			billingEmail: formData.get('billingEmail'),
			status: formData.get('status'),
			notes: formData.get('notes')
		};

		const result = UpdateStudentSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await StudentService.update(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Student code atau email sudah digunakan' });
			}
			console.error('Update Student Error:', error);
			return fail(500, { message: 'Gagal memperbarui data siswa' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await StudentService.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Delete Student Error:', error);
			return fail(500, { message: 'Gagal menghapus data siswa' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await StudentService.bulkDelete(ids);
			return { success: true, count: ids.length };
		} catch (error) {
			console.error('Bulk Delete Student Error:', error);
			return fail(500, { message: 'Gagal menghapus data siswa terpilih' });
		}
	}
});

export const actions: Actions = actionHandlers as Actions;
