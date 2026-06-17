import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	time,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { student } from '../../student/models/student.schema';

export const programStatusEnum = pgEnum('program_status', ['draft', 'published', 'archived']);
export const offeringTypeEnum = pgEnum('offering_type', ['batch', 'private']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', [
	'pending',
	'accepted',
	'rejected',
	'cancelled',
	'completed'
]);
export const attendanceStatusEnum = pgEnum('attendance_status', [
	'present',
	'late',
	'excused',
	'absent'
]);
export const locationTypeEnum = pgEnum('location_type', ['remote', 'onsite']);
export const eventRegistrationStatusEnum = pgEnum('event_registration_status', [
	'pending',
	'confirmed',
	'cancelled'
]);

export const program = pgTable('programs', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	summary: text('summary').notNull(),
	eyebrow: text('eyebrow').notNull(),
	heroImage: text('hero_image').notNull(),
	heroImageAlt: text('hero_image_alt').notNull(),
	status: programStatusEnum('status').notNull().default('draft'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const programIntro = pgTable('program_intros', {
	id: text('id').primaryKey(),
	programId: text('program_id')
		.notNull()
		.references(() => program.id, { onDelete: 'cascade' })
		.unique(),
	introEyebrow: text('intro_eyebrow').notNull(),
	introTitle: text('intro_title').notNull(),
	introImage: text('intro_image').notNull(),
	introImageAlt: text('intro_image_alt').notNull(),
	deskripsi: text('deskripsi').array().notNull().default([]),
	learningBackground: text('learning_background').array().notNull().default([])
});

export const programMetric = pgTable('program_metrics', {
	id: text('id').primaryKey(),
	programId: text('program_id')
		.notNull()
		.references(() => program.id, { onDelete: 'cascade' }),
	label: text('label').notNull(),
	value: text('value').notNull(),
	icon: text('icon').notNull(),
	position: integer('position').notNull()
});

export const programOffering = pgTable(
	'program_offerings',
	{
		id: text('id').primaryKey(),
		programId: text('program_id')
			.notNull()
			.references(() => program.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		type: offeringTypeEnum('type').notNull(),
		name: text('name').notNull(),
		title: text('title').notNull(),
		priceAmount: integer('price_amount').notNull(),
		currency: text('currency').notNull().default('IDR'),
		badge: text('badge'),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('program_offering_program_slug_idx').on(table.programId, table.slug)]
);

export const programOfferingBenefit = pgTable('program_offering_benefits', {
	id: text('id').primaryKey(),
	offeringId: text('offering_id')
		.notNull()
		.references(() => programOffering.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	position: integer('position').notNull()
});

export const programOfferingSchedule = pgTable('program_offering_schedules', {
	id: text('id').primaryKey(),
	offeringId: text('offering_id')
		.notNull()
		.references(() => programOffering.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	position: integer('position').notNull()
});

export const programBatch = pgTable(
	'program_batches',
	{
		id: text('id').primaryKey(),
		offeringId: text('offering_id')
			.notNull()
			.references(() => programOffering.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		registrationOpenAt: timestamp('registration_open_at', {
			withTimezone: true,
			mode: 'date'
		}),
		registrationCloseAt: timestamp('registration_close_at', {
			withTimezone: true,
			mode: 'date'
		}),
		startDate: date('start_date', { mode: 'string' }),
		endDate: date('end_date', { mode: 'string' }),
		capacity: integer('capacity'),
		isOpen: boolean('is_open').notNull().default(false),
		locationType: locationTypeEnum('location_type').notNull().default('onsite'),
		location: text('location'),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('program_batch_offering_slug_idx').on(table.offeringId, table.slug)]
);

export const batchSchedule = pgTable('batch_schedules', {
	id: text('id').primaryKey(),
	batchId: text('batch_id')
		.notNull()
		.references(() => programBatch.id, { onDelete: 'cascade' }),
	dayOfWeek: integer('day_of_week').notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	timezone: text('timezone').notNull().default('Asia/Jakarta')
});

export const programMilestone = pgTable(
	'program_milestones',
	{
		id: text('id').primaryKey(),
		programId: text('program_id')
			.notNull()
			.references(() => program.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		weeks: text('weeks').notNull(),
		description: text('description').notNull(),
		output: text('output').notNull(),
		icon: text('icon').notNull().default('foundation'),
		position: integer('position').notNull()
	},
	(table) => [uniqueIndex('program_milestone_position_idx').on(table.programId, table.position)]
);

export const technology = pgTable('technologies', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull().unique(),
	iconKey: text('icon_key').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true)
});

export const milestoneTechnology = pgTable(
	'milestone_technologies',
	{
		milestoneId: text('milestone_id')
			.notNull()
			.references(() => programMilestone.id, { onDelete: 'cascade' }),
		technologyId: text('technology_id')
			.notNull()
			.references(() => technology.id, { onDelete: 'restrict' }),
		position: integer('position').notNull().default(0)
	},
	(table) => [primaryKey({ columns: [table.milestoneId, table.technologyId] })]
);

export const enrollment = pgTable(
	'enrollments',
	{
		id: text('id').primaryKey(),
		studentId: text('student_id')
			.notNull()
			.references(() => student.id, { onDelete: 'cascade' }),
		offeringId: text('offering_id')
			.notNull()
			.references(() => programOffering.id, { onDelete: 'restrict' }),
		batchId: text('batch_id').references(() => programBatch.id, { onDelete: 'restrict' }),
		motivation: text('motivation').notNull(),
		referralSource: text('referral_source').notNull(),
		hasProgrammingBasics: boolean('has_programming_basics').notNull().default(false),
		usesAiTools: boolean('uses_ai_tools').notNull().default(false),
		status: enrollmentStatusEnum('status').notNull().default('pending'),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('enrollment_student_batch_idx')
			.on(table.studentId, table.batchId)
			.where(sql`${table.batchId} is not null`),
		uniqueIndex('enrollment_student_private_offering_idx')
			.on(table.studentId, table.offeringId)
			.where(sql`${table.batchId} is null`)
	]
);

export const attendanceSession = pgTable('attendance_sessions', {
	id: text('id').primaryKey(),
	batchId: text('batch_id')
		.notNull()
		.references(() => programBatch.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	sessionDate: date('session_date', { mode: 'string' }).notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const attendanceRecord = pgTable(
	'attendance_records',
	{
		id: text('id').primaryKey(),
		sessionId: text('session_id')
			.notNull()
			.references(() => attendanceSession.id, { onDelete: 'cascade' }),
		enrollmentId: text('enrollment_id')
			.notNull()
			.references(() => enrollment.id, { onDelete: 'cascade' }),
		status: attendanceStatusEnum('status').notNull().default('absent'),
		notes: text('notes'),
		checkedAt: timestamp('checked_at', { withTimezone: true, mode: 'date' })
	},
	(table) => [uniqueIndex('attendance_session_enrollment_idx').on(table.sessionId, table.enrollmentId)]
);

export const publicEvent = pgTable('events', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	summary: text('summary').notNull(),
	description: text('description'),
	eventType: text('event_type'),
	imageUrl: text('image_url'),
	imageAlt: text('image_alt'),
	location: text('location'),
	priceAmount: integer('price_amount'),
	currency: text('currency').notNull().default('IDR'),
	startAt: timestamp('start_at', { withTimezone: true, mode: 'date' }),
	endAt: timestamp('end_at', { withTimezone: true, mode: 'date' }),
	registrationUrl: text('registration_url'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const eventRegistration = pgTable(
	'event_registrations',
	{
		id: text('id').primaryKey(),
		eventId: text('event_id')
			.notNull()
			.references(() => publicEvent.id, { onDelete: 'cascade' }),
		fullName: text('full_name').notNull(),
		email: text('email').notNull(),
		phone: text('phone').notNull(),
		domicile: text('domicile').notNull(),
		participantType: text('participant_type').notNull(),
		organizationName: text('organization_name'),
		referralSource: text('referral_source').notNull(),
		referralSourceOther: text('referral_source_other'),
		interestedInCodingAi: boolean('interested_in_coding_ai').notNull().default(false),
		status: eventRegistrationStatusEnum('status').notNull().default('pending'),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('event_registration_event_email_idx').on(table.eventId, table.email)
	]
);

export const programAudienceBenefit = pgTable('program_audience_benefits', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	position: integer('position').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export const facility = pgTable('facilities', {
	id: text('id').primaryKey(),
	label: text('label').notNull(),
	imageUrl: text('image_url').notNull(),
	imageAlt: text('image_alt').notNull(),
	position: integer('position').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export const programFaq = pgTable('program_faqs', {
	id: text('id').primaryKey(),
	question: text('question').notNull(),
	answer: text('answer').notNull(),
	position: integer('position').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export const registrationPerk = pgTable('registration_perks', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	position: integer('position').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export const socialLink = pgTable('social_links', {
	id: text('id').primaryKey(),
	platform: text('platform').notNull(),
	url: text('url').notNull(),
	iconKey: text('icon_key').notNull(),
	position: integer('position').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export type EnrollmentStatus = (typeof enrollmentStatusEnum.enumValues)[number];
export type EventRegistrationStatus = (typeof eventRegistrationStatusEnum.enumValues)[number];
