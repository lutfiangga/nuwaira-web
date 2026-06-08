import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}

	if (!['admin', 'student'].includes(event.locals.user.role)) {
		redirect(302, '/');
	}

	return {
		user: event.locals.user,
		panelRole: event.locals.user.role === 'admin' ? ('admin' as const) : ('student' as const)
	};
};
