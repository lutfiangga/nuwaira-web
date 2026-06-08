import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	role: text('role').notNull().default('admin'),
	name: text('name'),
	phone: text('phone'),
	education: text('education'),
	motivation: text('motivation'),
	studentType: text('student_type').notNull().default('personal'),
	companyName: text('company_name'),
	photo: text('photo'),
	passwordHash: text('password_hash').notNull()
}).enableRLS();

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
}).enableRLS();

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
