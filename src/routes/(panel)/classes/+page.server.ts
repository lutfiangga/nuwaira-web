import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BootcampClassService } from '$lib/app/modules/bootcamp-class/services/bootcamp-class.service';
import {
	CreateBootcampClassSchema,
	UpdateBootcampClassSchema
} from '$lib/app/modules/bootcamp-class/requests/bootcamp-class.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'classes', 'read');
	const classes = await BootcampClassService.getAll();
	return { classes };
};

const actionHandlers = guardCrudActions('classes', {
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			code: formData.get('code'),
			title: formData.get('title'),
			level: formData.get('level'),
			mode: formData.get('mode'),
			mentorName: formData.get('mentorName'),
			durationWeeks: formData.get('durationWeeks'),
			totalSessions: formData.get('totalSessions'),
			price: formData.get('price'),
			description: formData.get('description'),
			startDate: formData.get('startDate'),
			endDate: formData.get('endDate'),
			status: formData.get('status')
		};

		const result = CreateBootcampClassSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await BootcampClassService.create(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Kode kelas sudah digunakan' });
			}
			console.error('Create Class Error:', error);
			return fail(500, { message: 'Gagal membuat kelas' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			code: formData.get('code'),
			title: formData.get('title'),
			level: formData.get('level'),
			mode: formData.get('mode'),
			mentorName: formData.get('mentorName'),
			durationWeeks: formData.get('durationWeeks'),
			totalSessions: formData.get('totalSessions'),
			price: formData.get('price'),
			description: formData.get('description'),
			startDate: formData.get('startDate'),
			endDate: formData.get('endDate'),
			status: formData.get('status')
		};

		const result = UpdateBootcampClassSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await BootcampClassService.update(result.data);
			return { success: true };
		} catch (error: any) {
			if (error?.code === '23505') {
				return fail(400, { message: 'Kode kelas sudah digunakan' });
			}
			console.error('Update Class Error:', error);
			return fail(500, { message: 'Gagal memperbarui kelas' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await BootcampClassService.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Delete Class Error:', error);
			return fail(500, { message: 'Gagal menghapus kelas' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await BootcampClassService.bulkDelete(ids);
			return { success: true, count: ids.length };
		} catch (error) {
			console.error('Bulk Delete Class Error:', error);
			return fail(500, { message: 'Gagal menghapus kelas terpilih' });
		}
	}
});

export const actions: Actions = actionHandlers as Actions;
