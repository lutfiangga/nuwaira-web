import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import { student, user } from '$lib/app/database/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const [profile] = await db
		.select({
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			photo: user.photo,
			fullName: student.fullName,
			birthDate: student.birthDate,
			fullAddress: student.fullAddress,
			provinceName: student.provinceName,
			regencyName: student.regencyName,
			activeEducation: student.activeEducation,
			religion: student.religion
		})
		.from(user)
		.leftJoin(student, eq(student.userId, user.id))
		.where(eq(user.id, locals.user.id))
		.limit(1);
	return { profile };
};
