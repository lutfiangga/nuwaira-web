import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/app/database';
import { student, user } from '$lib/app/database/schema';
import { LocationService } from '$lib/app/services/location.service';
import * as auth from '$lib/app/server/auth';
import { hashPassword } from '$lib/app/server/auth';
import { createSensitiveIndex, encryptSensitiveValue } from '$lib/app/server/encryption';
import { verifyTurnstileToken } from '$lib/app/server/turnstile';

const requiredString = (message: string, minLength = 1) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z.string().trim().min(minLength, message)
	);

const emailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z
		.string()
		.trim()
		.min(1, 'Email wajib diisi')
		.email('Email tidak valid')
		.transform((value) => value.toLowerCase())
);

const whatsappSchema = (message: string) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z
			.string()
			.trim()
			.min(8, message)
			.regex(/^[0-9+\-\s()]+$/, 'Nomor WhatsApp tidak valid')
	);

const yesNoSchema = (message: string) =>
	z.preprocess(
		(value) => (value === 'yes' || value === 'no' ? value : ''),
		z.enum(['yes', 'no'], { message }).transform((value) => value === 'yes')
	);

const registrationSchema = z
	.object({
		fullName: requiredString('Nama lengkap wajib diisi', 2),
		nik: z.preprocess(
			(value) => (typeof value === 'string' ? value.trim() : ''),
			z.string().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit')
		),
		birthDate: z.preprocess(
			(value) => (typeof value === 'string' ? value : ''),
			z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal lahir wajib diisi')
				.refine((value) => new Date(`${value}T00:00:00`).getTime() <= Date.now(), {
					message: 'Tanggal lahir tidak valid'
				})
		),
		whatsapp: whatsappSchema('WhatsApp wajib diisi'),
		email: emailSchema,
		fullAddress: requiredString('Alamat lengkap wajib diisi', 10),
		provinceId: requiredString('Provinsi wajib dipilih'),
		regencyId: requiredString('Kabupaten/kota wajib dipilih'),
		districtId: requiredString('Kecamatan wajib dipilih'),
		villageId: requiredString('Kelurahan/desa wajib dipilih'),
		activeEducation: requiredString('Pendidikan aktif wajib diisi', 2),
		religion: requiredString('Agama wajib dipilih'),
		guardianName: requiredString('Nama wali wajib diisi', 2),
		guardianRelation: requiredString('Hubungan dengan wali wajib dipilih'),
		guardianWhatsapp: whatsappSchema('WhatsApp wali wajib diisi'),
		referralSource: requiredString('Sumber informasi wajib dipilih'),
		programGoal: requiredString('Tujuan mengikuti program wajib diisi', 10),
		hasProgrammingBasics: yesNoSchema('Pilih pengalaman basic programming'),
		usesAiTools: yesNoSchema('Pilih pengalaman menggunakan tools AI'),
		password: requiredString('Password wajib diisi', 8),
		confirmPassword: requiredString('Konfirmasi password wajib diisi', 8),
		cfTurnstileResponse: z.string().optional()
	})
	.refine((value) => value.password === value.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Konfirmasi password tidak sama'
	});

type FormValues = Record<string, string>;

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.role === 'student') {
		redirect(302, '/dashboard');
	}

	return {
		provinces: await LocationService.getProvinces()
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const values = getFormValues(formData);
		const result = registrationSchema.safeParse({
			...values,
			cfTurnstileResponse: formData.get('cf-turnstile-response')
		});

		if (!result.success) {
			return fail(400, {
				message: 'Data pendaftaran belum lengkap',
				errors: result.error.flatten().fieldErrors,
				values
			});
		}

		const turnstileValid = await verifyTurnstileToken(result.data.cfTurnstileResponse || '');
		if (!turnstileValid) {
			return fail(400, {
				message: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		const payload = result.data;
		const location = await resolveLocation(payload);

		if (!location) {
			return fail(400, {
				message: 'Data lokasi tidak valid atau layanan lokasi sedang tidak tersedia.',
				errors: { provinceId: ['Pilih kembali lokasi domisili'] },
				values
			});
		}

		let nikHash = '';
		let nikEncrypted = '';

		try {
			nikHash = createSensitiveIndex(payload.nik);
			nikEncrypted = encryptSensitiveValue(payload.nik);
		} catch (error) {
			console.error('NIK encryption configuration error:', error);
			return fail(500, {
				message: 'Konfigurasi keamanan data belum tersedia.',
				errors: {},
				values
			});
		}

		const [existingEmail, existingNik] = await Promise.all([
			db.select({ id: user.id }).from(user).where(eq(user.email, payload.email)).limit(1),
			db.select({ id: student.id }).from(student).where(eq(student.nikHash, nikHash)).limit(1)
		]);

		if (existingEmail.length > 0 || existingNik.length > 0) {
			return fail(400, {
				message: existingEmail.length > 0 ? 'Email sudah terdaftar' : 'NIK sudah terdaftar',
				errors: {
					...(existingEmail.length > 0 ? { email: ['Email sudah terdaftar'] } : {}),
					...(existingNik.length > 0 ? { nik: ['NIK sudah terdaftar'] } : {})
				},
				values
			});
		}

		const userId = generateId();

		try {
			const passwordHash = await hashPassword(payload.password);

			await db.transaction(async (tx) => {
				await tx.insert(user).values({
					id: userId,
					email: payload.email,
					role: 'student',
					name: payload.fullName,
					phone: payload.whatsapp,
					education: payload.activeEducation,
					motivation: payload.programGoal,
					studentType: 'personal',
					companyName: null,
					photo: null,
					passwordHash
				});

				await tx.insert(student).values({
					id: generateId(),
					userId,
					fullName: payload.fullName,
					nikEncrypted,
					nikHash,
					birthDate: payload.birthDate,
					whatsapp: payload.whatsapp,
					email: payload.email,
					fullAddress: payload.fullAddress,
					provinceId: location.province.id,
					provinceName: location.province.name,
					regencyId: location.regency.id,
					regencyName: location.regency.name,
					districtId: location.district.id,
					districtName: location.district.name,
					villageId: location.village.id,
					villageName: location.village.name,
					activeEducation: payload.activeEducation,
					religion: payload.religion,
					guardianName: payload.guardianName,
					guardianRelation: payload.guardianRelation,
					guardianWhatsapp: payload.guardianWhatsapp,
					referralSource: payload.referralSource,
					programGoal: payload.programGoal,
					hasProgrammingBasics: payload.hasProgrammingBasics,
					usesAiTools: payload.usesAiTools
				});
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Student registration error:', error);
			return fail(500, {
				message: 'Pendaftaran gagal diproses. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		redirect(303, '/dashboard');
	}
};

function getFormValues(formData: FormData): FormValues {
	const fields = [
		'fullName',
		'nik',
		'birthDate',
		'whatsapp',
		'email',
		'fullAddress',
		'provinceId',
		'regencyId',
		'districtId',
		'villageId',
		'activeEducation',
		'religion',
		'guardianName',
		'guardianRelation',
		'guardianWhatsapp',
		'referralSource',
		'programGoal',
		'hasProgrammingBasics',
		'usesAiTools'
	] as const;

	return Object.fromEntries(
		fields.map((field) => {
			const value = formData.get(field);
			return [field, typeof value === 'string' ? value : ''];
		})
	);
}

async function resolveLocation(payload: {
	provinceId: string;
	regencyId: string;
	districtId: string;
	villageId: string;
}) {
	const [provinces, regencies, districts, villages] = await Promise.all([
		LocationService.getProvinces(),
		LocationService.getCities(payload.provinceId),
		LocationService.getDistricts(payload.regencyId),
		LocationService.getVillages(payload.districtId)
	]);

	const province = provinces.find((item) => item.id === payload.provinceId);
	const regency = regencies.find((item) => item.id === payload.regencyId);
	const district = districts.find((item) => item.id === payload.districtId);
	const village = villages.find((item) => item.id === payload.villageId);

	return province && regency && district && village
		? { province, regency, district, village }
		: null;
}

function generateId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}
