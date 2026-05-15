import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const student = pgTable('student', {
	id: text('id').primaryKey(),
	studentCode: text('student_code').notNull().unique(),
	fullName: text('full_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone'),
	gender: text('gender').notNull().default('other'),
	track: text('track').notNull().default('personal'),
	companyName: text('company_name'),
	jobTitle: text('job_title'),
	billingContact: text('billing_contact'),
	billingEmail: text('billing_email'),
	status: text('status').notNull().default('active'),
	notes: text('notes'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type Student = typeof student.$inferSelect;
