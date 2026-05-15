import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { bootcampClass } from '../../bootcamp-class/models/bootcamp-class.schema';

export const classMaterial = pgTable('class_material', {
	id: text('id').primaryKey(),
	classId: text('class_id')
		.notNull()
		.references(() => bootcampClass.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	materialType: text('material_type').notNull().default('topic'),
	orderNo: integer('order_no').notNull().default(1),
	durationMinutes: integer('duration_minutes'),
	learningOutcome: text('learning_outcome'),
	resourceUrl: text('resource_url'),
	isRequired: boolean('is_required').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
}).enableRLS();

export type ClassMaterial = typeof classMaterial.$inferSelect;
