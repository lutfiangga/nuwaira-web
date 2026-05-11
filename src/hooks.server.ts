import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/app/server/auth';
import { db } from '$lib/app/database';
import { user as userTable } from '$lib/app/modules/user/models/user.schema';
import { eq } from 'drizzle-orm';
import { withDbNullable } from '$lib/app/server/db';

/**
 * Hook Keamanan.
 * Menambahkan header keamanan HTTP ke setiap respons untuk melindungi dari:
 * - Clickjacking (X-Frame-Options)
 * - MIME-sniffing (X-Content-Type-Options)
 * - XSS (X-XSS-Protection, Permissions-Policy)
 */
const securityHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
};

/**
 * Hook Otentikasi.
 * Memvalidasi sesi pengguna pada setiap permintaan.
 * Jika sesi valid, data pengguna akan dilampirkan ke `event.locals`.
 */
const authenticationHandle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	event.locals.user = null;
	event.locals.session = null;

	if (!sessionToken) {
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		// Mengambil data pengguna lengkap dari database
		const fullUser = await withDbNullable('hooks.authenticationHandle.fetchFullUser', async () => {
			const [result] = await db
				.select({
					id: userTable.id,
					username: userTable.username,
					email: userTable.email,
					name: userTable.name,
					photo: userTable.photo,
					// age: userTable.age
				})
				.from(userTable)
				.where(eq(userTable.id, user.id))
				.limit(1);

			return result ?? null;
		});

		event.locals.user = fullUser || user;
		event.locals.session = session;
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	return resolve(event);
};

export const handle = sequence(securityHandle, authenticationHandle);
