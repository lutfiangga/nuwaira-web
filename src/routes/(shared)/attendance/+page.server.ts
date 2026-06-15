import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/app/database';
import {
	attendanceRecord,
	attendanceSession,
	enrollment,
	program,
	programBatch,
	programOffering,
	student,
	user
} from '$lib/app/database/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const query = db
		.select({
			id: attendanceRecord.id,
			status: attendanceRecord.status,
			notes: attendanceRecord.notes,
			sessionTitle: attendanceSession.title,
			sessionDate: attendanceSession.sessionDate,
			startTime: attendanceSession.startTime,
			endTime: attendanceSession.endTime,
			studentName: student.fullName,
			programTitle: program.title,
			batchTitle: programBatch.title
		})
		.from(attendanceRecord)
		.innerJoin(attendanceSession, eq(attendanceSession.id, attendanceRecord.sessionId))
		.innerJoin(enrollment, eq(enrollment.id, attendanceRecord.enrollmentId))
		.innerJoin(student, eq(student.id, enrollment.studentId))
		.innerJoin(user, eq(user.id, student.userId))
		.innerJoin(programOffering, eq(programOffering.id, enrollment.offeringId))
		.innerJoin(program, eq(program.id, programOffering.programId))
		.innerJoin(programBatch, eq(programBatch.id, attendanceSession.batchId))
		.orderBy(desc(attendanceSession.sessionDate));

	const records =
		locals.user.role === 'admin' ? await query : await query.where(eq(user.id, locals.user.id));
	return { records, isAdmin: locals.user.role === 'admin' };
};
