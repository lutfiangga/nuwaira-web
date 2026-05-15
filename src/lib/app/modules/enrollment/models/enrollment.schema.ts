import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { student } from '../../student/models/student.schema';
import { bootcampClass } from '../../bootcamp-class/models/bootcamp-class.schema';

export const enrollment = pgTable(
	'enrollment',
	{
		id: text('id').primaryKey(),
		studentId: text('student_id')
			.notNull()
			.references(() => student.id, { onDelete: 'cascade' }),
		classId: text('class_id')
			.notNull()
			.references(() => bootcampClass.id, { onDelete: 'cascade' }),
		enrollmentDate: timestamp('enrollment_date', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow(),
		status: text('status').notNull().default('active'),
		paymentStatus: text('payment_status').notNull().default('pending'),
		finalScore: integer('final_score'),
		notes: text('notes'),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
	},
	(table) => [unique('enrollment_student_class_unique').on(table.studentId, table.classId)]
).enableRLS();

export type Enrollment = typeof enrollment.$inferSelect;
