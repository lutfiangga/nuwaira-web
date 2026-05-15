import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { withDbFallback } from '$lib/app/server/db';
import { enrollment } from '../models/enrollment.schema';
import type { CreateEnrollmentDTO, UpdateEnrollmentDTO } from '../requests/enrollment.request';

function nullableText(value?: string) {
	return value?.trim() ? value.trim() : null;
}

export class EnrollmentService {
	static async getAll() {
		return withDbFallback(
			'EnrollmentService.getAll',
			async () => {
				const { student } = await import('$lib/app/modules/student/models/student.schema');
				const { bootcampClass } = await import(
					'$lib/app/modules/bootcamp-class/models/bootcamp-class.schema'
				);

				return await db
					.select({
						id: enrollment.id,
						studentId: enrollment.studentId,
						studentCode: student.studentCode,
						studentName: student.fullName,
						classId: enrollment.classId,
						classCode: bootcampClass.code,
						classTitle: bootcampClass.title,
						enrollmentDate: enrollment.enrollmentDate,
						status: enrollment.status,
						paymentStatus: enrollment.paymentStatus,
						finalScore: enrollment.finalScore,
						notes: enrollment.notes,
						createdAt: enrollment.createdAt,
						updatedAt: enrollment.updatedAt
					})
					.from(enrollment)
					.leftJoin(student, eq(enrollment.studentId, student.id))
					.leftJoin(bootcampClass, eq(enrollment.classId, bootcampClass.id))
					.orderBy(desc(enrollment.createdAt));
			},
			[]
		);
	}

	static async create(data: CreateEnrollmentDTO) {
		await db.insert(enrollment).values({
			id: crypto.randomUUID(),
			studentId: data.studentId,
			classId: data.classId,
			status: data.status,
			paymentStatus: data.paymentStatus,
			finalScore: data.finalScore ?? null,
			notes: nullableText(data.notes),
			enrollmentDate: new Date(),
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	static async update(data: UpdateEnrollmentDTO) {
		await db
			.update(enrollment)
			.set({
				studentId: data.studentId,
				classId: data.classId,
				status: data.status,
				paymentStatus: data.paymentStatus,
				finalScore: data.finalScore ?? null,
				notes: nullableText(data.notes),
				updatedAt: new Date()
			})
			.where(eq(enrollment.id, data.id));
	}

	static async delete(id: string) {
		await db.delete(enrollment).where(eq(enrollment.id, id));
	}

	static async bulkDelete(ids: string[]) {
		for (const id of ids) {
			await this.delete(id);
		}
	}
}
