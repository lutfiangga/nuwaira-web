import { pgTable, integer, text, timestamp, json } from 'drizzle-orm/pg-core';

export const product = pgTable('product', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    categoryId: text('category_id').notNull(),
    price: integer('price').notNull(),
    stock: integer('stock').notNull().default(0),
    images: json('images').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type Product = typeof product.$inferSelect;
