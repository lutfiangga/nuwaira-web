import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import * as auth from '$lib/app/server/auth';
import { db } from '$lib/app/database';
import * as table from '$lib/app/database/schema';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const intent = formData.get('intent');
		const passwordInput = formData.get('password');

		if (!validatePassword(passwordInput)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const password = passwordInput;

		if (intent === 'register') {
			const usernameInput = formData.get('username');
			const emailInput = formData.get('email');

			if (!validateUsername(usernameInput)) {
				return fail(400, {
					message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
				});
			}

			if (!validateEmail(emailInput)) {
				return fail(400, { message: 'Invalid email address' });
			}

			const username = usernameInput;
			const email = emailInput.toLowerCase();

			try {
				const existingUsername = await db.select().from(table.user).where(eq(table.user.username, username));
				if (existingUsername.length > 0) {
					return fail(400, { message: 'Username already taken' });
				}

				const existingEmail = await db.select().from(table.user).where(eq(table.user.email, email));
				if (existingEmail.length > 0) {
					return fail(400, { message: 'Email already registered' });
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

			return redirect(302, '/dashboard');
		}

		const loginIdentifierInput = formData.get('username');
		if (!validateLoginIdentifier(loginIdentifierInput)) {
			return fail(400, { message: 'Username atau email wajib diisi' });
		}

		const loginIdentifier = loginIdentifierInput.trim();
		const loginIdentifierLower = loginIdentifier.toLowerCase();

		try {
			const results = await db
				.select()
				.from(table.user)
				.where(
					or(eq(table.user.username, loginIdentifier), eq(table.user.email, loginIdentifierLower))
				);

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

			return redirect(302, '/dashboard');
		} catch (error) {
			console.error('Login Error:', error);
			return fail(503, { message: 'Database is unavailable. Please try again later.' });
		}
	}
};

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' &&
		email.length > 3 &&
		email.length <= 254 &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	);
}

function validateLoginIdentifier(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}
