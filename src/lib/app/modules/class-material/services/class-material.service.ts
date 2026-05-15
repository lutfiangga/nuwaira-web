import { asc, desc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { withDbFallback } from '$lib/app/server/db';
import { classMaterial } from '../models/class-material.schema';
import type {
	CreateClassMaterialDTO,
	UpdateClassMaterialDTO
} from '../requests/class-material.request';

function nullableText(value?: string) {
	return value?.trim() ? value.trim() : null;
}

export class ClassMaterialService {
	static async getAll() {
		return withDbFallback(
			'ClassMaterialService.getAll',
			async () => {
				const { bootcampClass } = await import(
					'$lib/app/modules/bootcamp-class/models/bootcamp-class.schema'
				);

				return await db
					.select({
						id: classMaterial.id,
						classId: classMaterial.classId,
						classCode: bootcampClass.code,
						classTitle: bootcampClass.title,
						title: classMaterial.title,
						materialType: classMaterial.materialType,
						orderNo: classMaterial.orderNo,
						durationMinutes: classMaterial.durationMinutes,
						learningOutcome: classMaterial.learningOutcome,
						resourceUrl: classMaterial.resourceUrl,
						isRequired: classMaterial.isRequired,
						createdAt: classMaterial.createdAt,
						updatedAt: classMaterial.updatedAt
					})
					.from(classMaterial)
					.leftJoin(bootcampClass, eq(classMaterial.classId, bootcampClass.id))
					.orderBy(asc(classMaterial.orderNo), desc(classMaterial.createdAt));
			},
			[]
		);
	}

	static async create(data: CreateClassMaterialDTO) {
		await db.insert(classMaterial).values({
			id: crypto.randomUUID(),
			classId: data.classId,
			title: data.title.trim(),
			materialType: data.materialType,
			orderNo: data.orderNo,
			durationMinutes: data.durationMinutes ?? null,
			learningOutcome: nullableText(data.learningOutcome),
			resourceUrl: nullableText(data.resourceUrl),
			isRequired: data.isRequired,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	static async update(data: UpdateClassMaterialDTO) {
		await db
			.update(classMaterial)
			.set({
				classId: data.classId,
				title: data.title.trim(),
				materialType: data.materialType,
				orderNo: data.orderNo,
				durationMinutes: data.durationMinutes ?? null,
				learningOutcome: nullableText(data.learningOutcome),
				resourceUrl: nullableText(data.resourceUrl),
				isRequired: data.isRequired,
				updatedAt: new Date()
			})
			.where(eq(classMaterial.id, data.id));
	}

	static async delete(id: string) {
		await db.delete(classMaterial).where(eq(classMaterial.id, id));
	}

	static async bulkDelete(ids: string[]) {
		for (const id of ids) {
			await this.delete(id);
		}
	}
}
