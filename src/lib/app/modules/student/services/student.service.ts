import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { student, user } from '$lib/app/database/schema';
import { createSensitiveIndex, decryptSensitiveValue } from '$lib/app/server/encryption';
import type { StudentStatus } from '../models/student.schema';

export class StudentService {
	static async getAll(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		status?: StudentStatus;
	}) {
		const search = params.search?.trim() ?? '';
		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));
		const offset = (page - 1) * pageSize;
		const nikHash = /^\d{16}$/.test(search) ? createSensitiveIndex(search) : null;
		const searchClause = search
			? or(
					ilike(student.fullName, `%${search}%`),
					ilike(student.email, `%${search}%`),
					ilike(student.whatsapp, `%${search}%`),
					ilike(student.regencyName, `%${search}%`),
					...(nikHash ? [eq(student.nikHash, nikHash)] : [])
				)
			: undefined;
		const whereClause = and(
			params.status ? eq(student.status, params.status) : undefined,
			searchClause
		);

		const [rows, totalRows] = await Promise.all([
			db
				.select({
					id: student.id,
					userId: student.userId,
					fullName: student.fullName,
					nikEncrypted: student.nikEncrypted,
					email: student.email,
					whatsapp: student.whatsapp,
					activeEducation: student.activeEducation,
					status: student.status,
					regencyName: student.regencyName,
					provinceName: student.provinceName,
					createdAt: student.createdAt,
					accountEmail: user.email
				})
				.from(student)
				.innerJoin(user, eq(user.id, student.userId))
				.where(whereClause)
				.orderBy(desc(student.createdAt))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(student)
				.where(whereClause)
		]);

		return {
			students: rows.map(({ nikEncrypted, ...row }) => ({
				...row,
				nik: decryptNik(nikEncrypted)
			})),
			total: Number(totalRows[0]?.count ?? 0),
			page,
			pageSize
		};
	}

	static async getById(id: string) {
		const [row] = await db
			.select({
				id: student.id,
				userId: student.userId,
				fullName: student.fullName,
				nikEncrypted: student.nikEncrypted,
				birthDate: student.birthDate,
				whatsapp: student.whatsapp,
				email: student.email,
				fullAddress: student.fullAddress,
				provinceName: student.provinceName,
				regencyName: student.regencyName,
				districtName: student.districtName,
				villageName: student.villageName,
				activeEducation: student.activeEducation,
				religion: student.religion,
				guardianName: student.guardianName,
				guardianRelation: student.guardianRelation,
				guardianWhatsapp: student.guardianWhatsapp,
				referralSource: student.referralSource,
				programGoal: student.programGoal,
				hasProgrammingBasics: student.hasProgrammingBasics,
				usesAiTools: student.usesAiTools,
				status: student.status,
				createdAt: student.createdAt,
				updatedAt: student.updatedAt,
				accountEmail: user.email,
				accountRole: user.role
			})
			.from(student)
			.innerJoin(user, eq(user.id, student.userId))
			.where(and(eq(student.id, id), eq(user.role, 'student')))
			.limit(1);

		if (!row) return null;

		const { nikEncrypted, ...studentData } = row;
		return {
			...studentData,
			nik: decryptNik(nikEncrypted)
		};
	}

	static async updateStatus(id: string, status: StudentStatus, expectedStatus?: StudentStatus) {
		const [updated] = await db
			.update(student)
			.set({ status, updatedAt: new Date() })
			.where(
				and(eq(student.id, id), expectedStatus ? eq(student.status, expectedStatus) : undefined)
			)
			.returning({ id: student.id, status: student.status });

		return updated ?? null;
	}
}

function decryptNik(value: string) {
	try {
		return decryptSensitiveValue(value);
	} catch (error) {
		console.error('Failed to decrypt student NIK:', error);
		return null;
	}
}
