import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { StudentService } from '$lib/app/modules/student/services/student.service';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const result = await StudentService.getAll({ search, page, pageSize, status: 'pending' });

	return {
		...result,
		search
	};
};

export const actions: Actions = {
	accept: async ({ request }) => updateStatus(request, 'accepted'),
	reject: async ({ request }) => updateStatus(request, 'rejected')
};

async function updateStatus(request: Request, status: 'accepted' | 'rejected') {
	const formData = await request.formData();
	const id = formData.get('id');

	if (typeof id !== 'string' || !id) {
		return fail(400, { message: 'ID calon siswa tidak valid' });
	}

	const updated = await StudentService.updateStatus(id, status, 'pending');
	if (!updated) {
		return fail(404, { message: 'Calon siswa tidak ditemukan atau status sudah berubah' });
	}

	return { success: true, status };
}
