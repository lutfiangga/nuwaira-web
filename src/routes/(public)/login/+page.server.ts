import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/app/database';
import { user } from '$lib/app/database/schema';
import * as auth from '$lib/app/server/auth';
import { verifyPassword } from '$lib/app/server/auth';
import { verifyTurnstileToken } from '$lib/app/server/turnstile';

const LoginEmailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z
		.string()
		.trim()
		.min(1, 'Email wajib diisi')
		.email('Email tidak valid')
		.transform((value) => value.toLowerCase())
);

const LoginPasswordSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().min(1, 'Password wajib diisi')
);

const LoginSchema = z.object({
	email: LoginEmailSchema,
	password: LoginPasswordSchema,
	returnTo: z.string().optional(),
	cfTurnstileResponse: z.string().optional()
});

function getRedirectPath(role: string) {
	return role === 'admin' || role === 'student' ? '/dashboard' : '/';
}

export const load: PageServerLoad = async (event) => {
	const returnTo = safeReturnTo(event.url.searchParams.get('returnTo'));
	if (event.locals.user) {
		redirect(302, returnTo ?? getRedirectPath(event.locals.user.role));
	}

	return { returnTo };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const result = LoginSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password'),
			returnTo: formData.get('returnTo'),
			cfTurnstileResponse: formData.get('cf-turnstile-response')
		});

		if (!result.success) {
			return fail(400, {
				message: 'Form belum terisi',
				errors: result.error.flatten().fieldErrors
			});
		}

		const turnstileValid = await verifyTurnstileToken(result.data.cfTurnstileResponse || '');
		if (!turnstileValid) {
			return fail(400, {
				message: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
				errors: {}
			});
		}

		const [account] = await db
			.select()
			.from(user)
			.where(eq(user.email, result.data.email))
			.limit(1);

		if (!account) {
			return fail(400, {
				message: 'Email atau password salah',
				errors: {}
			});
		}

		const validPassword = await verifyPassword(account.passwordHash, result.data.password);
		if (!validPassword) {
			return fail(400, {
				message: 'Email atau password salah',
				errors: {}
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, account.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(303, safeReturnTo(result.data.returnTo) ?? getRedirectPath(account.role));
	}
};

function safeReturnTo(value: string | null | undefined) {
	if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
	return value;
}
