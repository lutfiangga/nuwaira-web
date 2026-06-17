import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { publicEvent } from '$lib/app/database/schema';

export const load: PageServerLoad = async ({ params }) => {
	const [event] = await db
		.select()
		.from(publicEvent)
		.where(eq(publicEvent.slug, params.slug))
		.limit(1);

	if (!event || !event.isActive) error(404, 'Acara tidak ditemukan');

	return { event };
};
