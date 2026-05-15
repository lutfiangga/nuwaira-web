import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { withDbFallback } from '$lib/app/server/db';
import { bootcampClass } from '../models/bootcamp-class.schema';
import type {
	CreateBootcampClassDTO,
	UpdateBootcampClassDTO
} from '../requests/bootcamp-class.request';

function nullableText(value?: string) {
	return value?.trim() ? value.trim() : null;
}

function toDate(value?: string) {
	if (!value) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export class BootcampClassService {
	static async getAll() {
		return withDbFallback(
			'BootcampClassService.getAll',
			async () => await db.select().from(bootcampClass).orderBy(desc(bootcampClass.createdAt)),
			[]
		);
	}

	static async create(data: CreateBootcampClassDTO) {
		await db.insert(bootcampClass).values({
			id: crypto.randomUUID(),
			code: data.code.trim(),
			title: data.title.trim(),
			level: data.level,
			mode: data.mode,
			mentorName: nullableText(data.mentorName),
			durationWeeks: data.durationWeeks,
			totalSessions: data.totalSessions,
			price: data.price,
			description: nullableText(data.description),
			startDate: toDate(data.startDate),
			endDate: toDate(data.endDate),
			status: data.status,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	static async update(data: UpdateBootcampClassDTO) {
		await db
			.update(bootcampClass)
			.set({
				code: data.code.trim(),
				title: data.title.trim(),
				level: data.level,
				mode: data.mode,
				mentorName: nullableText(data.mentorName),
				durationWeeks: data.durationWeeks,
				totalSessions: data.totalSessions,
				price: data.price,
				description: nullableText(data.description),
				startDate: toDate(data.startDate),
				endDate: toDate(data.endDate),
				status: data.status,
				updatedAt: new Date()
			})
			.where(eq(bootcampClass.id, data.id));
	}

	static async delete(id: string) {
		await db.delete(bootcampClass).where(eq(bootcampClass.id, id));
	}

	static async bulkDelete(ids: string[]) {
		for (const id of ids) {
			await this.delete(id);
		}
	}
}
