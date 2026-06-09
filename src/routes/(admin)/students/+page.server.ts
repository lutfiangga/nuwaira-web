import type { PageServerLoad } from './$types';
import { StudentService } from '$lib/app/modules/student/services/student.service';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const result = await StudentService.getAll({ search, page, pageSize, status: 'accepted' });

	return {
		...result,
		search
	};
};
