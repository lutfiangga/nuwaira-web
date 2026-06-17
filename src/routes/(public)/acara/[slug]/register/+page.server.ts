import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/app/database';
import { publicEvent, eventRegistration } from '$lib/app/database/schema';
import { verifyTurnstileToken } from '$lib/app/server/turnstile';

function generateId() {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15)));
}

const requiredString = (message: string, minLength = 1) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z.string().trim().min(minLength, message)
	);

const emailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().trim().min(1, 'Email wajib diisi').email('Email tidak valid').toLowerCase()
);

const phoneSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().trim().min(8, 'Nomor telepon wajib diisi').regex(/^[0-9+\-\s()]+$/, 'Nomor telepon tidak valid')
);

const registrationSchema = z
	.object({
		fullName: requiredString('Nama lengkap wajib diisi', 2),
		email: emailSchema,
		phone: phoneSchema,
		domicile: requiredString('Domisili wajib diisi', 2),
		participantType: z.enum(['perorangan', 'instansi'], { message: 'Pilih tipe peserta' }),
		organizationName: z.string().trim().optional(),
		referralSource: requiredString('Sumber informasi wajib dipilih'),
		referralSourceOther: z.string().trim().optional(),
		interestedInCodingAi: z.preprocess(
			(value) => value === 'true' || value === true,
			z.boolean().default(false)
		),
		agreedToTerms: z.preprocess(
			(value) => value === 'true',
			z.literal(true, { message: 'Kamu harus menyetujui syarat dan ketentuan' })
		)
	})
	.refine((data) => data.participantType !== 'instansi' || Boolean(data.organizationName), {
		path: ['organizationName'],
		message: 'Nama instansi wajib diisi'
	})
	.refine((data) => data.referralSource !== 'Lainnya' || Boolean(data.referralSourceOther), {
		path: ['referralSourceOther'],
		message: 'Tuliskan sumber informasi'
	});

type FormValues = Record<string, string>;

export const load: PageServerLoad = async ({ params }) => {
	const [event] = await db
		.select()
		.from(publicEvent)
		.where(and(eq(publicEvent.slug, params.slug), eq(publicEvent.isActive, true)))
		.limit(1);

	if (!event) error(404, 'Acara tidak ditemukan');

	return { event };
};

function getFormValues(formData: FormData): FormValues {
	const fields = [
		'fullName',
		'email',
		'phone',
		'domicile',
		'participantType',
		'organizationName',
		'referralSource',
		'referralSourceOther',
		'interestedInCodingAi',
		'agreedToTerms'
	] as const;

	return Object.fromEntries(
		fields.map((field) => {
			const value = formData.get(field);
			return [field, typeof value === 'string' ? value : ''];
		})
	);
}

export const actions: Actions = {
	default: async (event) => {
		const { params } = event;

		const [eventData] = await db
			.select()
			.from(publicEvent)
			.where(and(eq(publicEvent.slug, params.slug), eq(publicEvent.isActive, true)))
			.limit(1);

		if (!eventData) {
			return fail(404, { message: 'Acara tidak ditemukan.', errors: {} });
		}

		const formData = await event.request.formData();
		const values = getFormValues(formData);
		const result = registrationSchema.safeParse(values);

		if (!result.success) {
			return fail(400, {
				message: 'Data pendaftaran belum lengkap.',
				errors: result.error.flatten().fieldErrors,
				values
			});
		}

		// Verify Turnstile
		const turnstileToken = formData.get('cf-turnstile-response');
		if (!(await verifyTurnstileToken(typeof turnstileToken === 'string' ? turnstileToken : ''))) {
			return fail(400, {
				message: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		const payload = result.data;

		// Check duplicate
		const [duplicate] = await db
			.select({ id: eventRegistration.id })
			.from(eventRegistration)
			.where(
				and(
					eq(eventRegistration.eventId, eventData.id),
					eq(eventRegistration.email, payload.email)
				)
			)
			.limit(1);

		if (duplicate) {
			return fail(409, {
				message: 'Email ini sudah terdaftar untuk acara ini.',
				errors: { email: ['Email sudah terdaftar'] },
				values
			});
		}

		const referralSource =
			payload.referralSource === 'Lainnya'
				? payload.referralSourceOther?.trim() || ''
				: payload.referralSource;

		try {
			await db.insert(eventRegistration).values({
				id: generateId(),
				eventId: eventData.id,
				fullName: payload.fullName,
				email: payload.email,
				phone: payload.phone,
				domicile: payload.domicile,
				participantType: payload.participantType,
				organizationName: payload.participantType === 'instansi' ? (payload.organizationName ?? '') : null,
				referralSource,
				referralSourceOther: payload.referralSource === 'Lainnya' ? (payload.referralSourceOther ?? '') : null,
				interestedInCodingAi: payload.interestedInCodingAi,
				status: 'pending',
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (err) {
			console.error('Event registration error:', err);
			return fail(500, {
				message: 'Pendaftaran gagal diproses. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		redirect(303, `/acara/${params.slug}?registered=true`);
	}
};
