import type { RequestHandler } from './$types';
import * as auth from '$lib/app/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    if (!event.locals.session) {
        throw redirect(302, '/login');
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);
    throw redirect(302, '/login');
};
