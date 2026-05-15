import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/app/server/auth';
import { db } from '$lib/app/database';
import * as table from '$lib/app/database/schema';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/panel/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = asString(formData.get('username'));
		const password = asString(formData.get('password'));

		if (!validateUsername(username) || !validatePassword(password)) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		try {
			const results = await db.select().from(table.user).where(eq(table.user.username, username));
			const existingUser = results.at(0);
			if (!existingUser) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const validPassword = await verify(existingUser.passwordHash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			if (!validPassword) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return redirect(302, '/panel/dashboard');
		} catch (error) {
			console.error('Login Error:', error);
			return fail(503, { message: 'Database is unavailable. Please try again later.' });
		}
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = asString(formData.get('username'));
		const password = asString(formData.get('password'));
		const rawEmail = asString(formData.get('email'));
		const email = rawEmail || `${username}@example.com`;

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username (min 3, max 31 characters, alphanumeric only)' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		try {
			const existingUsers = await db.select().from(table.user).where(eq(table.user.username, username));
			if (existingUsers.length > 0) {
				return fail(400, { message: 'Username already taken' });
			}

			const userId = generateUserId();
			const roleId = await RbacService.getDefaultRegisterRoleId();
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			await db.insert(table.user).values({
				id: userId,
				username,
				email,
				roleId,
				passwordHash
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Register Error:', error);
			return fail(503, { message: 'Database is unavailable. Please try again later.' });
		}
		return redirect(302, '/panel/dashboard');
	}
};

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function asString(value: FormDataEntryValue | null) {
	return typeof value === 'string' ? value.trim() : '';
}

function validateUsername(username: string): boolean {
	return username.length >= 3 && username.length <= 31 && /^[a-z0-9_-]+$/.test(username);
}

function validatePassword(password: string): boolean {
	return password.length >= 6 && password.length <= 255;
}
