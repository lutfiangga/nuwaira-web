import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { publicEvent } from '$lib/app/database/schema';

export const load: PageServerLoad = async ({ params }) => {
	const [event] = await db
		.select()
		.from(publicEvent)
		.where(eq(publicEvent.id, params.id))
		.limit(1);

	if (!event) error(404, 'Event not found');

	return { event };
};
