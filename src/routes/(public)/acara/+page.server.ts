import type { PageServerLoad } from './$types';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { publicEvent } from '$lib/app/database/schema';

export const load: PageServerLoad = async () => {
	const events = await db
		.select()
		.from(publicEvent)
		.where(eq(publicEvent.isActive, true))
		.orderBy(asc(publicEvent.startAt));

	return { events };
};
