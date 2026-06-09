import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { asc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { student as studentTable, user } from '$lib/app/database/schema';
import { decryptSensitiveValue } from '$lib/app/server/encryption';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}

	const [accountRow] = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			studentType: user.studentType,
			photo: user.photo,
			activeEducation: studentTable.activeEducation,
			programGoal: studentTable.programGoal,
			nikEncrypted: studentTable.nikEncrypted
		})
		.from(user)
		.leftJoin(studentTable, eq(studentTable.userId, user.id))
		.where(eq(user.id, event.locals.user.id))
		.limit(1);

	if (!accountRow) {
		redirect(302, '/login');
	}

	const { nikEncrypted, ...accountData } = accountRow;
	const account = {
		...accountData,
		nik: decryptNik(nikEncrypted)
	};

	if (account.role === 'admin') {
		const [summary] = await db
			.select({
				totalUsers: sql<number>`count(*)`,
				totalStudents: sql<number>`count(*) filter (where ${user.role} = 'student')`,
				totalAdmins: sql<number>`count(*) filter (where ${user.role} = 'admin')`,
				totalPersonal: sql<number>`count(*) filter (where ${user.role} = 'student' and ${user.studentType} = 'personal')`,
				totalBusiness: sql<number>`count(*) filter (where ${user.role} = 'student' and ${user.studentType} = 'business')`
			})
			.from(user);

		const students = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				studentType: user.studentType,
				activeEducation: studentTable.activeEducation,
				nikEncrypted: studentTable.nikEncrypted
			})
			.from(user)
			.leftJoin(studentTable, eq(studentTable.userId, user.id))
			.where(eq(user.role, 'student'))
			.orderBy(asc(user.name), asc(user.email))
			.limit(8);

		return {
			view: 'admin' as const,
			account,
			admin: {
				summary: {
					totalUsers: Number(summary?.totalUsers ?? 0),
					totalStudents: Number(summary?.totalStudents ?? 0),
					totalAdmins: Number(summary?.totalAdmins ?? 0),
					totalPersonal: Number(summary?.totalPersonal ?? 0),
					totalBusiness: Number(summary?.totalBusiness ?? 0)
				},
				students: students.map(({ nikEncrypted: encryptedNik, ...studentData }) => ({
					...studentData,
					nik: decryptNik(encryptedNik)
				}))
			},
			student: null
		};
	}

	if (account.role !== 'student') {
		redirect(302, '/');
	}

	return {
		view: 'student' as const,
		account,
		admin: null,
		student: account
	};
};

function decryptNik(value: string | null) {
	if (!value) return null;

	try {
		return decryptSensitiveValue(value);
	} catch (error) {
		console.error('Failed to decrypt student NIK:', error);
		return null;
	}
}
