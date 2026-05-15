import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'dashboard', 'read');
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return {
		user: event.locals.user
	};
};
