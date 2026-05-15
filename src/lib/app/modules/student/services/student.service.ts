import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { withDbFallback } from '$lib/app/server/db';
import { student } from '../models/student.schema';
import type { CreateStudentDTO, UpdateStudentDTO } from '../requests/student.request';

function nullableText(value?: string) {
	return value?.trim() ? value.trim() : null;
}

export class StudentService {
	static async getAll() {
		return withDbFallback(
			'StudentService.getAll',
			async () => await db.select().from(student).orderBy(desc(student.createdAt)),
			[]
		);
	}

	static async create(data: CreateStudentDTO) {
		await db.insert(student).values({
			id: crypto.randomUUID(),
			studentCode: data.studentCode.trim(),
			fullName: data.fullName.trim(),
			email: data.email.trim().toLowerCase(),
			phone: nullableText(data.phone),
			gender: data.gender,
			track: data.track,
			companyName: nullableText(data.companyName),
			jobTitle: nullableText(data.jobTitle),
			billingContact: nullableText(data.billingContact),
			billingEmail: nullableText(data.billingEmail)?.toLowerCase() ?? null,
			status: data.status,
			notes: nullableText(data.notes),
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	static async update(data: UpdateStudentDTO) {
		await db
			.update(student)
			.set({
				studentCode: data.studentCode.trim(),
				fullName: data.fullName.trim(),
				email: data.email.trim().toLowerCase(),
				phone: nullableText(data.phone),
				gender: data.gender,
				track: data.track,
				companyName: nullableText(data.companyName),
				jobTitle: nullableText(data.jobTitle),
				billingContact: nullableText(data.billingContact),
				billingEmail: nullableText(data.billingEmail)?.toLowerCase() ?? null,
				status: data.status,
				notes: nullableText(data.notes),
				updatedAt: new Date()
			})
			.where(eq(student.id, data.id));
	}

	static async delete(id: string) {
		await db.delete(student).where(eq(student.id, id));
	}

	static async bulkDelete(ids: string[]) {
		for (const id of ids) {
			await this.delete(id);
		}
	}
}
