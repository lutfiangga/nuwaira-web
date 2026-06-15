import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/app/database';
import {
	enrollment,
	program,
	programOffering,
	student,
	user
} from '$lib/app/database/schema';
import { ProgramService } from '$lib/app/modules/program/services/program.service';
import { LocationService } from '$lib/app/services/location.service';
import * as auth from '$lib/app/server/auth';
import { hashPassword } from '$lib/app/server/auth';
import {
	createSensitiveIndex,
	decryptSensitiveValue,
	encryptSensitiveValue
} from '$lib/app/server/encryption';
import { verifyTurnstileToken } from '$lib/app/server/turnstile';

const requiredString = (message: string, minLength = 1) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z.string().trim().min(minLength, message)
	);

const emailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value : ''),
	z.string().trim().min(1, 'Email wajib diisi').email('Email tidak valid').toLowerCase()
);

const whatsappSchema = (message: string) =>
	z.preprocess(
		(value) => (typeof value === 'string' ? value : ''),
		z.string().trim().min(8, message).regex(/^[0-9+\-\s()]+$/, 'Nomor WhatsApp tidak valid')
	);

const yesNoSchema = (message: string) =>
	z.preprocess(
		(value) => (value === 'yes' || value === 'no' ? value : ''),
		z.enum(['yes', 'no'], { message }).transform((value) => value === 'yes')
	);

const profileSchema = z
	.object({
		accountMode: z.enum(['new', 'existing']).default('new'),
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
		religionOther: z.string().trim().optional(),
		guardianName: requiredString('Nama wali wajib diisi', 2),
		guardianRelation: requiredString('Hubungan dengan wali wajib dipilih'),
		guardianRelationOther: z.string().trim().optional(),
		guardianWhatsapp: whatsappSchema('WhatsApp wali wajib diisi'),
		referralSource: requiredString('Sumber informasi wajib dipilih'),
		referralSourceOther: z.string().trim().optional(),
		programGoal: requiredString('Tujuan mengikuti program wajib diisi', 10),
		hasProgrammingBasics: yesNoSchema('Pilih pengalaman basic programming'),
		usesAiTools: yesNoSchema('Pilih pengalaman menggunakan tools AI'),
		agreedToTerms: z.preprocess(
			(value) => value === 'true',
			z.literal(true, { message: 'Kamu harus menyetujui pernyataan pendaftaran' })
		)
	})
	.refine((value) => value.religion !== 'Lainnya' || Boolean(value.religionOther), {
		path: ['religionOther'],
		message: 'Tuliskan agama'
	})
	.refine((value) => value.guardianRelation !== 'Lainnya' || Boolean(value.guardianRelationOther), {
		path: ['guardianRelationOther'],
		message: 'Tuliskan hubungan dengan wali'
	})
	.refine((value) => value.referralSource !== 'Lainnya' || Boolean(value.referralSourceOther), {
		path: ['referralSourceOther'],
		message: 'Tuliskan sumber informasi'
	});

const newAccountSchema = z
	.object({
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
	const selection = await resolveSelection(event.url);

	const [programs, offerings] = await Promise.all([
		db
			.select({ slug: program.slug, title: program.title })
			.from(program)
			.where(and(eq(program.status, 'published'), eq(program.isActive, true)))
			.orderBy(asc(program.title)),
		db
			.select({
				slug: programOffering.slug,
				programSlug: program.slug,
				name: programOffering.name,
				title: programOffering.title,
				type: programOffering.type,
				priceAmount: programOffering.priceAmount
			})
			.from(programOffering)
			.innerJoin(program, eq(program.id, programOffering.programId))
			.where(and(eq(programOffering.isActive, true), eq(program.status, 'published'), eq(program.isActive, true)))
			.orderBy(asc(programOffering.name))
	]);

	let prefill: FormValues = {};
	let hasStudentProfile = false;

	if (event.locals.user?.role === 'student') {
		const [row] = await db
			.select({
				name: user.name,
				email: user.email,
				phone: user.phone,
				fullName: student.fullName,
				nikEncrypted: student.nikEncrypted,
				birthDate: student.birthDate,
				fullAddress: student.fullAddress,
				provinceId: student.provinceId,
				regencyId: student.regencyId,
				districtId: student.districtId,
				villageId: student.villageId,
				activeEducation: student.activeEducation,
				religion: student.religion,
				guardianName: student.guardianName,
				guardianRelation: student.guardianRelation,
				guardianWhatsapp: student.guardianWhatsapp
			})
			.from(user)
			.leftJoin(student, eq(student.userId, user.id))
			.where(eq(user.id, event.locals.user.id))
			.limit(1);

		if (row) {
			hasStudentProfile = Boolean(row.fullName);
			prefill = {
				fullName: row.fullName ?? row.name ?? '',
				nik: decryptNik(row.nikEncrypted),
				birthDate: row.birthDate ?? '',
				whatsapp: row.phone ?? '',
				email: row.email,
				fullAddress: row.fullAddress ?? '',
				provinceId: row.provinceId ?? '',
				regencyId: row.regencyId ?? '',
				districtId: row.districtId ?? '',
				villageId: row.villageId ?? '',
				activeEducation: row.activeEducation ?? '',
				religion: row.religion ?? '',
				guardianName: row.guardianName ?? '',
				guardianRelation: row.guardianRelation ?? '',
				guardianWhatsapp: row.guardianWhatsapp ?? ''
			};
		}
	}

	return {
		provinces: await LocationService.getProvinces(),
		programs,
		offerings,
		selection: selection
			? {
					programTitle: selection.programTitle,
					offeringName: selection.offeringName,
					offeringType: selection.offeringType,
					batchTitle: selection.batchTitle,
					schedule: selection.schedule,
					price: selection.price
				}
			: null,
		isAuthenticated: event.locals.user?.role === 'student',
		hasStudentProfile,
		prefill,
		loginUrl: `/login?returnTo=${encodeURIComponent(event.url.pathname + event.url.search)}`
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const formProgram = formData.get('program')?.toString().trim() || '';
		const formOffering = formData.get('offering')?.toString().trim() || '';

		let selection = null;
		if (formProgram && formOffering) {
			selection = await ProgramService.getRegistrationSelection(formProgram, formOffering);
		}
		if (!selection) {
			selection = await resolveSelection(event.url);
		}
		if (!selection) return fail(400, { message: 'Program atau batch tidak valid.', errors: {} });

		const values = getFormValues(formData);
		const profileResult = profileSchema.safeParse(values);

		if (!profileResult.success) {
			return fail(400, {
				message: 'Data pendaftaran belum lengkap',
				errors: profileResult.error.flatten().fieldErrors,
				values
			});
		}

		const loggedInUser = event.locals.user?.role === 'student' ? event.locals.user : null;
		if (!loggedInUser && profileResult.data.accountMode === 'existing') {
			return fail(401, {
				message: 'Silakan login terlebih dahulu untuk memakai akun yang sudah terdaftar.',
				errors: {},
				values,
				loginUrl: `/login?returnTo=${encodeURIComponent(event.url.pathname + event.url.search)}`
			});
		}

		const accountResult = loggedInUser
			? null
			: newAccountSchema.safeParse({
					password: formData.get('password'),
					confirmPassword: formData.get('confirmPassword'),
					cfTurnstileResponse: formData.get('cf-turnstile-response')
				});

		if (accountResult && !accountResult.success) {
			return fail(400, {
				message: 'Data akun belum lengkap',
				errors: accountResult.error.flatten().fieldErrors,
				values
			});
		}

		if (
			accountResult &&
			!(await verifyTurnstileToken(accountResult.data.cfTurnstileResponse || ''))
		) {
			return fail(400, {
				message: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		const payload = profileResult.data;
		const location = await resolveLocation(payload);
		if (!location) {
			return fail(400, {
				message: 'Data lokasi tidak valid atau layanan lokasi sedang tidak tersedia.',
				errors: { provinceId: ['Pilih kembali lokasi domisili'] },
				values
			});
		}

		const nikHash = createSensitiveIndex(payload.nik);
		const nikEncrypted = encryptSensitiveValue(payload.nik);
		const [emailOwner, nikOwner, currentProfiles] = await Promise.all([
			db.select({ id: user.id }).from(user).where(eq(user.email, payload.email)).limit(1),
			db
				.select({ id: student.id, userId: student.userId })
				.from(student)
				.where(eq(student.nikHash, nikHash))
				.limit(1),
			loggedInUser
				? db
						.select({ id: student.id })
						.from(student)
						.where(eq(student.userId, loggedInUser.id))
						.limit(1)
				: Promise.resolve([])
		]);
		const currentProfile = currentProfiles[0];

		if (!loggedInUser && emailOwner.length) {
			return fail(409, {
				message: 'Email sudah memiliki akun. Pilih "Sudah punya akun" lalu login.',
				errors: { email: ['Email sudah terdaftar'] },
				values,
				loginUrl: `/login?returnTo=${encodeURIComponent(event.url.pathname + event.url.search)}`
			});
		}

		if (loggedInUser && nikOwner[0] && nikOwner[0].userId !== loggedInUser.id) {
			return fail(409, {
				message: 'NIK sudah digunakan oleh akun lain.',
				errors: { nik: ['NIK sudah terdaftar'] },
				values
			});
		}

		if (!loggedInUser && nikOwner.length) {
			return fail(409, {
				message: 'NIK sudah terdaftar. Silakan login dengan akun yang sesuai.',
				errors: { nik: ['NIK sudah terdaftar'] },
				values
			});
		}

		const userId = loggedInUser?.id ?? generateId();
		const studentId = currentProfile?.id ?? nikOwner[0]?.id ?? generateId();
		const religion =
			payload.religion === 'Lainnya' ? payload.religionOther?.trim() || '' : payload.religion;
		const guardianRelation =
			payload.guardianRelation === 'Lainnya'
				? payload.guardianRelationOther?.trim() || ''
				: payload.guardianRelation;
		const referralSource =
			payload.referralSource === 'Lainnya'
				? payload.referralSourceOther?.trim() || ''
				: payload.referralSource;

		try {
			await db.transaction(async (tx) => {
				if (!loggedInUser && accountResult?.success) {
					await tx.insert(user).values({
						id: userId,
						email: payload.email,
						role: 'student',
						name: payload.fullName,
						phone: payload.whatsapp,
						studentType: 'personal',
						photo: null,
						passwordHash: await hashPassword(accountResult.data.password)
					});
				} else {
					await tx
						.update(user)
						.set({ name: payload.fullName, phone: payload.whatsapp })
						.where(eq(user.id, userId));
				}

				const profileValues = {
					fullName: payload.fullName,
					nikEncrypted,
					nikHash,
					birthDate: payload.birthDate,
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
					religion,
					guardianName: payload.guardianName,
					guardianRelation,
					guardianWhatsapp: payload.guardianWhatsapp,
					updatedAt: new Date()
				};

				if (currentProfile || nikOwner.length) {
					await tx.update(student).set(profileValues).where(eq(student.id, studentId));
				} else {
					await tx.insert(student).values({ id: studentId, userId, ...profileValues });
				}

				const duplicate = await tx
					.select({ id: enrollment.id })
					.from(enrollment)
					.where(
						and(
							eq(enrollment.studentId, studentId),
							eq(enrollment.offeringId, selection.offeringId),
							selection.batchId
								? eq(enrollment.batchId, selection.batchId)
								: eq(enrollment.offeringId, selection.offeringId)
						)
					)
					.limit(1);

				if (duplicate.length) throw new Error('DUPLICATE_ENROLLMENT');

				await tx.insert(enrollment).values({
					id: generateId(),
					studentId,
					offeringId: selection.offeringId,
					batchId: selection.batchId,
					motivation: payload.programGoal,
					referralSource,
					hasProgrammingBasics: payload.hasProgrammingBasics,
					usesAiTools: payload.usesAiTools,
					status: 'pending'
				});
			});

			if (!loggedInUser) {
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, userId);
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			}
		} catch (error) {
			if (error instanceof Error && error.message === 'DUPLICATE_ENROLLMENT') {
				return fail(409, {
					message: 'Kamu sudah terdaftar pada program atau batch ini.',
					errors: {},
					values
				});
			}
			console.error('Enrollment registration error:', error);
			return fail(500, {
				message: 'Pendaftaran gagal diproses. Silakan coba lagi.',
				errors: {},
				values
			});
		}

		redirect(303, '/dashboard');
	}
};

async function resolveSelection(url: URL) {
	const requestedProgram = url.searchParams.get('program');
	const requestedOffering = url.searchParams.get('offering');
	const requestedBatch = url.searchParams.get('batch');
	if (!requestedProgram || !requestedOffering) return null;
	return ProgramService.getRegistrationSelection(
		requestedProgram,
		requestedOffering,
		requestedBatch ?? undefined
	);
}

function getFormValues(formData: FormData): FormValues {
	const fields = [
		'accountMode',
		'program',
		'offering',
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
		'religionOther',
		'guardianName',
		'guardianRelation',
		'guardianRelationOther',
		'guardianWhatsapp',
		'referralSource',
		'referralSourceOther',
		'programGoal',
		'hasProgrammingBasics',
		'usesAiTools',
		'agreedToTerms'
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

function decryptNik(value: string | null) {
	if (!value) return '';
	try {
		return decryptSensitiveValue(value);
	} catch {
		return '';
	}
}

function generateId() {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15)));
}
