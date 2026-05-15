import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const moments = pgTable('moments', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
    image: text('image').notNull(), // Single image URL
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type Moments = typeof moments.$inferSelect;
export type NewMoments = typeof moments.$inferInsert;
