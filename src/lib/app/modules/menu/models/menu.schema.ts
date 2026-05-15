import { pgTable, text, integer, json, timestamp } from 'drizzle-orm/pg-core';

export const menu = pgTable('menu', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(), // 'Food' | 'Beverage'
    price: integer('price').notNull(),
    description: text('description').notNull(),
    images: json('images').$type<string[]>().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type Menu = typeof menu.$inferSelect;
export type NewMenu = typeof menu.$inferInsert;
