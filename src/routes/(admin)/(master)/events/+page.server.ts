import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { publicEvent } from '$lib/app/database/schema';
import {
	CreateEventSchema,
	UpdateEventSchema
} from '$lib/app/modules/program/requests/event.request';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function generateId() {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15)));
}

function getErrorCode(error: unknown): string | undefined {
	if (error && typeof error === 'object' && 'code' in error) {
		return (error as { code?: string }).code;
	}
	return undefined;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 10;
	const sort = url.searchParams.get('sort') ?? 'title';
	const order = url.searchParams.get('order') ?? 'asc';
	const offset = (page - 1) * pageSize;

	const whereClause = search
		? or(ilike(publicEvent.title, `%${search}%`), ilike(publicEvent.slug, `%${search}%`))
		: undefined;

	const sortMap: Record<string, unknown> = {
		title: publicEvent.title,
		slug: publicEvent.slug,
		isActive: publicEvent.isActive,
		startAt: publicEvent.startAt,
		endAt: publicEvent.endAt,
		createdAt: publicEvent.createdAt
	};
	const sortCol = (sortMap[sort] as typeof publicEvent.title) || publicEvent.title;
	const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

	const [rows, totalResult] = await Promise.all([
		db
			.select()
			.from(publicEvent)
			.where(whereClause)
			.orderBy(orderBy)
			.limit(pageSize)
			.offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(publicEvent)
			.where(whereClause)
	]);

	return {
		events: rows,
		pagination: { page, limit: pageSize, total: totalResult[0]?.count ?? 0 },
		params: { search, sort, order }
	};
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = CreateEventSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await db.insert(publicEvent).values({
				id: generateId(),
				...result.data,
				startAt: result.data.startAt ? new Date(result.data.startAt) : null,
				endAt: result.data.endAt ? new Date(result.data.endAt) : null,
				registrationUrl: result.data.registrationUrl || null,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			return { success: true };
		} catch (error: unknown) {
			console.error('Create Event Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists' });
			}
			return fail(500, { message: `Failed to create event. ${getErrorMessage(error)}` });
		}
	},

	update: async (event) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData);

		const result = UpdateEventSchema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				message: 'Validation failed',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await db
				.update(publicEvent)
				.set({
					slug: result.data.slug,
					title: result.data.title,
					summary: result.data.summary,
					startAt: result.data.startAt ? new Date(result.data.startAt) : null,
					endAt: result.data.endAt ? new Date(result.data.endAt) : null,
					registrationUrl: result.data.registrationUrl || null,
					isActive: result.data.isActive,
					updatedAt: new Date()
				})
				.where(eq(publicEvent.id, result.data.id));
			return { success: true };
		} catch (error: unknown) {
			console.error('Update Event Error:', error);
			if (getErrorCode(error) === '23505') {
				return fail(400, { message: 'Slug already exists' });
			}
			return fail(500, { message: 'Failed to update event' });
		}
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		if (typeof id !== 'string') return fail(400, { message: 'Invalid ID' });

		try {
			await db.delete(publicEvent).where(eq(publicEvent.id, id));
			return { success: true };
		} catch (error: unknown) {
			console.error('Delete Event Error:', error);
			return fail(500, { message: 'Failed to delete event' });
		}
	},

	bulkDelete: async ({ request }) => {
		const form = await request.formData();
		const idsJson = form.get('ids');
		if (typeof idsJson !== 'string') return fail(400, { message: 'Invalid IDs' });

		try {
			const ids: string[] = JSON.parse(idsJson);
			if (!Array.isArray(ids) || ids.length === 0) {
				return fail(400, { message: 'No IDs provided' });
			}
			for (const id of ids) {
				await db.delete(publicEvent).where(eq(publicEvent.id, id));
			}
			return { success: true };
		} catch (error: unknown) {
			console.error('Bulk Delete Event Error:', error);
			return fail(500, { message: 'Failed to delete events' });
		}
	}
};
