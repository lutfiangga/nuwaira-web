import * as auth from '$lib/app/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { isGuest } from '$lib/app/middleware/auth.middleware';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	isGuest(event);
	return {};
};
export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}

};