import { pgTable, text, timestamp, real } from 'drizzle-orm/pg-core';

export const outlet = pgTable('outlet', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    province: text('province'),
    city: text('city'),
    district: text('district'),
    latitude: real('latitude'),
    longitude: real('longitude'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type Outlet = typeof outlet.$inferSelect;
