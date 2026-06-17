import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { publicEvent, eventRegistration } from '$lib/app/database/schema';

export const load: PageServerLoad = async ({ params }) => {
	const [event] = await db
		.select()
		.from(publicEvent)
		.where(eq(publicEvent.id, params.id))
		.limit(1);

	if (!event) error(404, 'Event not found');

	const [registrations, totalResult] = await Promise.all([
		db
			.select()
			.from(eventRegistration)
			.where(eq(eventRegistration.eventId, params.id))
			.orderBy(desc(eventRegistration.createdAt)),
		db
			.select({ count: sql<number>`count(*)` })
			.from(eventRegistration)
			.where(eq(eventRegistration.eventId, params.id))
	]);

	return {
		event,
		registrations,
		registrationTotal: totalResult[0]?.count ?? 0
	};
};
