import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as auth from '$lib/app/server/auth';

export const GET: RequestHandler = async (event) => {
	if (event.locals.user) {
		await auth.invalidateUserSessions(event.locals.user.id);
	} else if (event.locals.session) {
		await auth.invalidateSession(event.locals.session.id);
	}

	auth.deleteSessionTokenCookie(event);
	redirect(302, '/login');
};
