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
import { uploadCloudinaryImage } from '$lib/app/server/cloudinary';

const EVENT_IMAGE_FOLDER = 'events';

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

async function resolveImage(formData: FormData, field: string): Promise<string | undefined> {
	const file = formData.get(field);
	const uploaded = await (file instanceof File && file.size > 0 && file.name !== 'undefined'
		? uploadCloudinaryImage(file, EVENT_IMAGE_FOLDER).then((result) => result.url)
		: Promise.resolve(undefined));
	const existing = formData.getAll(`${field}_existing`);
	const latestExisting = existing.at(-1);
	return uploaded ?? (typeof latestExisting === 'string' ? latestExisting : undefined);
}

async function getEventRawData(formData: FormData) {
	const imageUrl = await resolveImage(formData, 'imageUrl');
	formData.set('imageUrl', imageUrl ?? '');
	return Object.fromEntries(formData);
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
		eventType: publicEvent.eventType,
		location: publicEvent.location,
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

function buildEventValues(data: ReturnType<typeof CreateEventSchema.parse>) {
	return {
		slug: data.slug,
		title: data.title,
		summary: data.description,
		description: data.description,
		eventType: data.eventType || null,
		imageUrl: data.imageUrl || null,
		imageAlt: null,
		location: data.location || null,
		priceAmount: data.priceAmount ?? null,
		currency: 'IDR',
		startAt: combineDateTime(data.startAt, data.startTime),
		endAt: combineDateTime(data.endAt, data.endTime),
		registrationUrl: null,
		isActive: data.isActive
	};
}

function combineDateTime(dateValue?: string | null, timeValue?: string | null) {
	return dateValue ? new Date(`${dateValue}T${timeValue ?? '00:00'}:00`) : null;
}

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const rawData = await getEventRawData(formData);

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
				...buildEventValues(result.data),
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
		const rawData = await getEventRawData(formData);

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
					...buildEventValues(result.data),
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

	toggleStatus: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');
		const isActive = form.get('isActive') === 'true';
		const isValidId = typeof id === 'string';
		const handlers = {
			valid: async () => {
				try {
					await db
						.update(publicEvent)
						.set({ isActive, updatedAt: new Date() })
						.where(eq(publicEvent.id, id as string));
					return { success: true };
				} catch (error: unknown) {
					console.error('Toggle Event Status Error:', error);
					return fail(500, { message: 'Failed to update event status' });
				}
			},
			invalid: async () => fail(400, { message: 'Invalid ID' })
		};

		return handlers[isValidId ? 'valid' : 'invalid']();
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
