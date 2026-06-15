import { eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import {
	programOffering,
	programOfferingBenefit
} from '$lib/app/modules/program/models/program.schema';
import type {
	CreateOfferingDTO,
	UpdateOfferingDTO
} from '$lib/app/modules/program/requests/offering.request';

export const OfferingService = {
	async createOffering(data: CreateOfferingDTO) {
		const id = crypto.randomUUID();
		await db.insert(programOffering).values({
			id,
			programId: data.programId,
			slug: data.slug,
			type: data.type,
			name: data.name,
			title: data.title,
			priceAmount: data.priceAmount,
			badge: data.badge || null
		});

		if (data.benefits.length > 0) {
			await db.insert(programOfferingBenefit).values(
				data.benefits.map((content, i) => ({
					id: crypto.randomUUID(),
					offeringId: id,
					content,
					position: i + 1
				}))
			);
		}

		return id;
	},

	async updateOffering(data: UpdateOfferingDTO) {
		await db
			.update(programOffering)
			.set({
				slug: data.slug,
				type: data.type,
				name: data.name,
				title: data.title,
				priceAmount: data.priceAmount,
				badge: data.badge || null,
				updatedAt: new Date()
			})
			.where(eq(programOffering.id, data.id));

		await db.delete(programOfferingBenefit).where(eq(programOfferingBenefit.offeringId, data.id));

		if (data.benefits.length > 0) {
			await db.insert(programOfferingBenefit).values(
				data.benefits.map((content, i) => ({
					id: crypto.randomUUID(),
					offeringId: data.id,
					content,
					position: i + 1
				}))
			);
		}
	},

	async deleteOffering(id: string) {
		await db.delete(programOffering).where(eq(programOffering.id, id));
	}
};
