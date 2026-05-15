import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const bootcampClass = pgTable('bootcamp_class', {
	id: text('id').primaryKey(),
	code: text('code').notNull().unique(),
	title: text('title').notNull(),
	level: text('level').notNull().default('beginner'),
	mode: text('mode').notNull().default('online'),
	mentorName: text('mentor_name'),
	durationWeeks: integer('duration_weeks').notNull().default(1),
	totalSessions: integer('total_sessions').notNull().default(1),
	price: integer('price').notNull().default(0),
	description: text('description'),
	startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }),
	endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }),
	status: text('status').notNull().default('draft'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type BootcampClass = typeof bootcampClass.$inferSelect;
