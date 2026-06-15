import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '$lib/app/database';
import {
	enrollment,
	program,
	programBatch,
	programOffering,
	student,
	user,
	type EnrollmentStatus
} from '$lib/app/database/schema';
import { createSensitiveIndex, decryptSensitiveValue } from '$lib/app/server/encryption';

export class StudentService {
	static async getAll(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		status?: EnrollmentStatus;
	}) {
		const search = params.search?.trim() ?? '';
		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));
		const offset = (page - 1) * pageSize;
		const nikHash = /^\d{16}$/.test(search) ? createSensitiveIndex(search) : null;
		const searchClause = search
			? or(
					ilike(student.fullName, `%${search}%`),
					ilike(user.email, `%${search}%`),
					ilike(user.phone, `%${search}%`),
					ilike(student.regencyName, `%${search}%`),
					...(nikHash ? [eq(student.nikHash, nikHash)] : [])
				)
			: undefined;
		const whereClause = and(
			params.status ? eq(enrollment.status, params.status) : undefined,
			searchClause
		);

		const baseSelect = {
			id: student.id,
			enrollmentId: enrollment.id,
			userId: student.userId,
			fullName: student.fullName,
			nikEncrypted: student.nikEncrypted,
			email: user.email,
			whatsapp: user.phone,
			activeEducation: student.activeEducation,
			status: enrollment.status,
			regencyName: student.regencyName,
			provinceName: student.provinceName,
			programTitle: program.title,
			batchTitle: programBatch.title,
			createdAt: enrollment.createdAt,
			accountEmail: user.email
		};

		const [rows, totalRows] = await Promise.all([
			db
				.select(baseSelect)
				.from(enrollment)
				.innerJoin(student, eq(student.id, enrollment.studentId))
				.innerJoin(user, eq(user.id, student.userId))
				.innerJoin(programOffering, eq(programOffering.id, enrollment.offeringId))
				.innerJoin(program, eq(program.id, programOffering.programId))
				.leftJoin(programBatch, eq(programBatch.id, enrollment.batchId))
				.where(whereClause)
				.orderBy(desc(enrollment.createdAt))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(enrollment)
				.innerJoin(student, eq(student.id, enrollment.studentId))
				.innerJoin(user, eq(user.id, student.userId))
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
				enrollmentId: enrollment.id,
				userId: student.userId,
				fullName: student.fullName,
				nikEncrypted: student.nikEncrypted,
				birthDate: student.birthDate,
				whatsapp: user.phone,
				email: user.email,
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
				referralSource: enrollment.referralSource,
				programGoal: enrollment.motivation,
				hasProgrammingBasics: enrollment.hasProgrammingBasics,
				usesAiTools: enrollment.usesAiTools,
				status: enrollment.status,
				programTitle: program.title,
				batchTitle: programBatch.title,
				createdAt: enrollment.createdAt,
				updatedAt: enrollment.updatedAt,
				accountEmail: user.email,
				accountRole: user.role
			})
			.from(student)
			.innerJoin(user, eq(user.id, student.userId))
			.innerJoin(enrollment, eq(enrollment.studentId, student.id))
			.innerJoin(programOffering, eq(programOffering.id, enrollment.offeringId))
			.innerJoin(program, eq(program.id, programOffering.programId))
			.leftJoin(programBatch, eq(programBatch.id, enrollment.batchId))
			.where(and(eq(student.id, id), eq(user.role, 'student')))
			.orderBy(desc(enrollment.createdAt))
			.limit(1);

		if (!row) return null;
		const { nikEncrypted, ...studentData } = row;
		return { ...studentData, nik: decryptNik(nikEncrypted) };
	}

	static async updateStatus(
		id: string,
		status: EnrollmentStatus,
		expectedStatus?: EnrollmentStatus
	) {
		const [target] = await db
			.select({ id: enrollment.id })
			.from(enrollment)
			.where(
				and(
					eq(enrollment.studentId, id),
					expectedStatus ? eq(enrollment.status, expectedStatus) : undefined
				)
			)
			.orderBy(desc(enrollment.createdAt))
			.limit(1);
		if (!target) return null;

		const [updated] = await db
			.update(enrollment)
			.set({ status, updatedAt: new Date() })
			.where(eq(enrollment.id, target.id))
			.returning({ id: enrollment.id, status: enrollment.status });
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
