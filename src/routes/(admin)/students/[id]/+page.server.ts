import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { StudentService } from '$lib/app/modules/student/services/student.service';

export const load: PageServerLoad = async ({ params }) => {
	const student = await StudentService.getById(params.id);

	if (!student) {
		error(404, 'Data siswa tidak ditemukan');
	}

	return { student };
};

export const actions: Actions = {
	accept: async ({ params }) => updateStatus(params.id, 'accepted'),
	reject: async ({ params }) => updateStatus(params.id, 'rejected')
};

async function updateStatus(id: string, status: 'accepted' | 'rejected') {
	const updated = await StudentService.updateStatus(id, status, 'pending');

	if (!updated) {
		return fail(404, { message: 'Calon siswa tidak ditemukan atau status sudah berubah' });
	}

	return { success: true, status };
}
