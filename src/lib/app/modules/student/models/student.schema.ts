import { date, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../user/models/user.schema';

// Kept for a safe transitional migration; enrollment status is now the active domain status.
export const legacyStudentStatusEnum = pgEnum('student_status', [
	'pending',
	'accepted',
	'rejected'
]);

export const student = pgTable('students', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	fullName: text('full_name').notNull(),
	nikEncrypted: text('nik_encrypted').notNull(),
	nikHash: text('nik_hash').notNull().unique(),
	birthDate: date('birth_date', { mode: 'string' }).notNull(),
	fullAddress: text('full_address').notNull(),
	provinceId: text('province_id').notNull(),
	provinceName: text('province_name').notNull(),
	regencyId: text('regency_id').notNull(),
	regencyName: text('regency_name').notNull(),
	districtId: text('district_id').notNull(),
	districtName: text('district_name').notNull(),
	villageId: text('village_id').notNull(),
	villageName: text('village_name').notNull(),
	activeEducation: text('active_education').notNull(),
	religion: text('religion').notNull(),
	guardianName: text('guardian_name').notNull(),
	guardianRelation: text('guardian_relation').notNull(),
	guardianWhatsapp: text('guardian_whatsapp').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
}).enableRLS();

export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;
