import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ClassMaterialService } from '$lib/app/modules/class-material/services/class-material.service';
import { BootcampClassService } from '$lib/app/modules/bootcamp-class/services/bootcamp-class.service';
import {
	CreateClassMaterialSchema,
	UpdateClassMaterialSchema
} from '$lib/app/modules/class-material/requests/class-material.request';
import { guardCrudActions, requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'materials', 'read');
	const [materials, classes] = await Promise.all([
		ClassMaterialService.getAll(),
		BootcampClassService.getAll()
	]);
	return { materials, classes };
};

const actionHandlers = guardCrudActions('materials', {
	create: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			classId: formData.get('classId'),
			title: formData.get('title'),
			materialType: formData.get('materialType'),
			orderNo: formData.get('orderNo'),
			durationMinutes: formData.get('durationMinutes'),
			learningOutcome: formData.get('learningOutcome'),
			resourceUrl: formData.get('resourceUrl'),
			isRequired: formData.get('isRequired')
		};

		const result = CreateClassMaterialSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await ClassMaterialService.create(result.data);
			return { success: true };
		} catch (error) {
			console.error('Create Material Error:', error);
			return fail(500, { message: 'Gagal membuat materi kelas' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const rawData = {
			id: formData.get('id'),
			classId: formData.get('classId'),
			title: formData.get('title'),
			materialType: formData.get('materialType'),
			orderNo: formData.get('orderNo'),
			durationMinutes: formData.get('durationMinutes'),
			learningOutcome: formData.get('learningOutcome'),
			resourceUrl: formData.get('resourceUrl'),
			isRequired: formData.get('isRequired')
		};

		const result = UpdateClassMaterialSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, { message: 'Validasi gagal', errors: result.error.flatten().fieldErrors });
		}

		try {
			await ClassMaterialService.update(result.data);
			return { success: true };
		} catch (error) {
			console.error('Update Material Error:', error);
			return fail(500, { message: 'Gagal memperbarui materi kelas' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await ClassMaterialService.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Delete Material Error:', error);
			return fail(500, { message: 'Gagal menghapus materi kelas' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];

		try {
			await ClassMaterialService.bulkDelete(ids);
			return { success: true, count: ids.length };
		} catch (error) {
			console.error('Bulk Delete Material Error:', error);
			return fail(500, { message: 'Gagal menghapus materi kelas terpilih' });
		}
	}
});

export const actions: Actions = actionHandlers as Actions;
