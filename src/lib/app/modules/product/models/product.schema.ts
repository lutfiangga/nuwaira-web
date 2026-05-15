import { pgTable, integer, text, timestamp, json } from 'drizzle-orm/pg-core';
import { category } from '../../category/models/category.schema';

export const product = pgTable('product', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    categoryId: text('category_id')
        .notNull()
        .references(() => category.id, { onDelete: 'cascade' }),
    price: integer('price').notNull(),
    stock: integer('stock').notNull().default(0),
    images: json('images').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type Product = typeof product.$inferSelect;
