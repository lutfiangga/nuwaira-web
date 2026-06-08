import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/app/database';
import { user } from '$lib/app/database/schema';
import * as auth from '$lib/app/server/auth';
import { hashPassword } from '$lib/app/server/auth';
import { uploadCloudinaryImage } from '$lib/app/server/cloudinary';
import { verifyTurnstileToken } from '$lib/app/server/turnstile';

const FormStringSchema = (message: string) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z.string().trim().min(1, message)
	);

const OptionalFormStringSchema = z.preprocess(
	(value) => (typeof value === 'string' && value.trim().length > 0 ? value : undefined),
	z.string().trim().optional()
);

const StudentTypeSchema = z.preprocess(
	(value) => (value === 'personal' || value === 'business' ? value : ''),
	z
		.string()
		.refine((value) => value === 'personal' || value === 'business', 'Pilih jalur pendaftaran')
		.transform((value) => value as 'personal' | 'business')
);

const EmailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z
		.string()
		.trim()
		.min(1, 'Email wajib diisi')
		.email('Email tidak valid')
		.transform((value) => value.toLowerCase())
);

const OptionalPhotoSchema = z.preprocess(
	(value) => (value instanceof File && value.size > 0 ? value : undefined),
	z
		.instanceof(File)
		.refine((file) => file.type.startsWith('image/'), 'File harus berupa gambar')
		.refine((file) => file.type !== 'image/gif', 'GIF tidak didukung')
		.refine((file) => file.size <= 5 * 1024 * 1024, 'Foto maksimal 5MB')
		.optional()
);

const RegistrationSchema = z
	.object({
		studentType: StudentTypeSchema,
		name: FormStringSchema('Nama wajib diisi').pipe(z.string().min(2, 'Nama minimal 2 karakter')),
		education: FormStringSchema('Pendidikan wajib diisi').pipe(
			z.string().min(2, 'Pendidikan wajib diisi')
		),
		customEducation: OptionalFormStringSchema,
		motivation: FormStringSchema('Motivasi wajib diisi').pipe(
			z.string().min(20, 'Motivasi minimal 20 karakter')
		),
		phone: z.preprocess(
			(value) => (typeof value === 'string' ? value : ''),
			z
				.string()
				.trim()
				.min(8, 'Nomor HP wajib diisi')
				.regex(/^[0-9+\-\s()]+$/, 'Nomor HP tidak valid')
		),
		companyName: OptionalFormStringSchema,
		email: EmailSchema,
		password: FormStringSchema('Password wajib diisi').pipe(
			z.string().min(8, 'Password minimal 8 karakter')
		),
		confirmPassword: FormStringSchema('Konfirmasi password wajib diisi').pipe(
			z.string().min(8, 'Konfirmasi password minimal 8 karakter')
		),
		photo: OptionalPhotoSchema,
		cfTurnstileResponse: z.string().optional()
	})
	.refine((value) => value.password === value.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Konfirmasi password tidak sama'
	})
	.refine((value) => value.studentType === 'personal' || Boolean(value.companyName?.trim()), {
		path: ['companyName'],
		message: 'Nama bisnis/perusahaan wajib diisi'
	})
	.refine((value) => value.education !== 'Lainnya' || Boolean(value.customEducation?.trim()), {
		path: ['customEducation'],
		message: 'Pendidikan lainnya wajib diisi'
	});

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.role === 'student') {
		redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const result = RegistrationSchema.safeParse({
			studentType: formData.get('studentType'),
			name: formData.get('name'),
			education: formData.get('education'),
			customEducation: formData.get('customEducation'),
			motivation: formData.get('motivation'),
			phone: formData.get('phone'),
			companyName: formData.get('companyName'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
			photo: formData.get('photo'),
			cfTurnstileResponse: formData.get('cf-turnstile-response')
		});

		if (!result.success) {
			return fail(400, {
				message: 'Data pendaftaran belum lengkap',
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

		const payload = result.data;
		const existingEmail = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, payload.email))
			.limit(1);

		if (existingEmail.length > 0) {
			return fail(400, {
				message: 'Email sudah terdaftar',
				errors: { email: ['Email sudah terdaftar'] }
			});
		}

		let userId = '';
		try {
			userId = generateUserId();
			const education =
				payload.education === 'Lainnya'
					? payload.customEducation?.trim() || payload.education
					: payload.education;
			const [passwordHash, photo] = await Promise.all([
				hashPassword(payload.password),
				payload.photo ? uploadCloudinaryImage(payload.photo) : Promise.resolve(null)
			]);

			await db.insert(user).values({
				id: userId,
				email: payload.email,
				role: 'student',
				name: payload.name,
				phone: payload.phone,
				education,
				motivation: payload.motivation,
				studentType: payload.studentType,
				companyName:
					payload.studentType === 'business' ? payload.companyName?.trim() || null : null,
				photo: photo?.url ?? null,
				passwordHash
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Bootcamp registration error:', error);
			return fail(500, {
				message:
					error instanceof Error ? error.message : 'Pendaftaran gagal diproses. Silakan coba lagi.',
				errors: {}
			});
		}

		redirect(303, '/dashboard');
	}
};

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}
