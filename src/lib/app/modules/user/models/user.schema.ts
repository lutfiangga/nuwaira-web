import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    name: text('name'),
    age: integer('age'),
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
