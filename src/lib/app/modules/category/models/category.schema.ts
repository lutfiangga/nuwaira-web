import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const category = pgTable('category', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type Category = typeof category.$inferSelect;
