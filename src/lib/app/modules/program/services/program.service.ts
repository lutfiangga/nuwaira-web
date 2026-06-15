import { encodeBase32LowerCase } from '@oslojs/encoding';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { db } from '$lib/app/database';
import {
	batchSchedule,
	enrollment,
	facility,
	milestoneTechnology,
	program,
	programAudienceBenefit,
	programBatch,
	programIntro,
	programMetric,
	programMilestone,
	programOffering,
	programOfferingBenefit,
	programOfferingSchedule,
	programFaq,
	publicEvent,
	registrationPerk,
	socialLink,
	student,
	technology,
	user
} from '$lib/app/database/schema';
import type { ProgramJourneyIcon, ProgramMetricIcon, ProgramPageData } from '$lib/types/program';
import type { CreateProgramDTO, UpdateProgramDTO } from '../requests/program.request';
import type { UpsertIntroDTO } from '../requests/intro.request';
import type { CreateMetricDTO, UpdateMetricDTO } from '../requests/metric.request';
import type { CreateBatchDTO, UpdateBatchDTO } from '../requests/batch.request';
import type { CreateEnrollmentDTO, UpdateEnrollmentDTO } from '../requests/enrollment.request';

export class ProgramService {
	static async getPublicNavigation() {
		const [programRows, offeringRows, batchRows, events, socialLinkRows] = await Promise.all([
			db
				.select({
					id: program.id,
					slug: program.slug,
					title: program.title,
					summary: program.summary,
					eyebrow: program.eyebrow,
					heroImage: program.heroImage,
					heroImageAlt: program.heroImageAlt
				})
				.from(program)
				.where(and(eq(program.status, 'published'), eq(program.isActive, true)))
				.orderBy(asc(program.title)),
			db
				.select({
					id: programOffering.id,
					programId: programOffering.programId,
					type: programOffering.type,
					isActive: programOffering.isActive
				})
				.from(programOffering)
				.where(eq(programOffering.isActive, true)),
			db
				.select({ offeringId: programBatch.offeringId, isOpen: programBatch.isOpen })
				.from(programBatch)
				.where(eq(programBatch.isOpen, true)),
			db
				.select({
					slug: publicEvent.slug,
					title: publicEvent.title,
					summary: publicEvent.summary,
					url: publicEvent.registrationUrl
				})
				.from(publicEvent)
				.where(eq(publicEvent.isActive, true))
				.orderBy(asc(publicEvent.title)),
			db
				.select({
					platform: socialLink.platform,
					url: socialLink.url,
					iconKey: socialLink.iconKey
				})
				.from(socialLink)
				.where(eq(socialLink.isActive, true))
				.orderBy(asc(socialLink.position))
		]);

		const openOfferingIds = new Set(batchRows.map((item) => item.offeringId));
		const visibleProgramIds = new Set(
			offeringRows
				.filter((item) => item.type === 'private' || openOfferingIds.has(item.id))
				.map((item) => item.programId)
		);

		return {
			programs: programRows.filter((item) => visibleProgramIds.has(item.id)),
			events: events.map((item) => ({ ...item, url: item.url || '/#acara' })),
			socialLinks: socialLinkRows
		};
	}

	static async getSharedProgramContent() {
		const [audienceBenefits, facilities, faqs, registrationPerks] = await Promise.all([
			db
				.select({
					id: programAudienceBenefit.id,
					title: programAudienceBenefit.title,
					description: programAudienceBenefit.description
				})
				.from(programAudienceBenefit)
				.where(eq(programAudienceBenefit.isActive, true))
				.orderBy(asc(programAudienceBenefit.position)),
			db
				.select({
					id: facility.id,
					label: facility.label,
					src: facility.imageUrl,
					alt: facility.imageAlt
				})
				.from(facility)
				.where(eq(facility.isActive, true))
				.orderBy(asc(facility.position)),
			db
				.select({ id: programFaq.id, question: programFaq.question, answer: programFaq.answer })
				.from(programFaq)
				.where(eq(programFaq.isActive, true))
				.orderBy(asc(programFaq.position)),
			db
				.select({
					id: registrationPerk.id,
					title: registrationPerk.title,
					description: registrationPerk.description
				})
				.from(registrationPerk)
				.where(eq(registrationPerk.isActive, true))
				.orderBy(asc(registrationPerk.position))
		]);
		return { audienceBenefits, facilities, faqs, registrationPerks };
	}

	static async getPublicProgramBySlug(slug: string): Promise<ProgramPageData | null> {
		const [row] = await db
			.select()
			.from(program)
			.where(
				and(eq(program.slug, slug), eq(program.status, 'published'), eq(program.isActive, true))
			)
			.limit(1);
		if (!row) return null;

		const [introRow, metrics, milestones, offerings] = await Promise.all([
			db
				.select()
				.from(programIntro)
				.where(eq(programIntro.programId, row.id))
				.limit(1)
				.then((r) => r[0] ?? null),
			db
				.select()
				.from(programMetric)
				.where(eq(programMetric.programId, row.id))
				.orderBy(asc(programMetric.position)),
			db
				.select()
				.from(programMilestone)
				.where(eq(programMilestone.programId, row.id))
				.orderBy(asc(programMilestone.position)),
			db
				.select()
				.from(programOffering)
				.where(and(eq(programOffering.programId, row.id), eq(programOffering.isActive, true)))
				.orderBy(asc(programOffering.name))
		]);

		const journeyStages = await Promise.all(
			milestones.map(async (milestone) => {
				const tools = await db
					.select({ name: technology.name, iconKey: technology.iconKey })
					.from(milestoneTechnology)
					.innerJoin(technology, eq(technology.id, milestoneTechnology.technologyId))
					.where(eq(milestoneTechnology.milestoneId, milestone.id))
					.orderBy(asc(milestoneTechnology.position));
				return {
					id: milestone.id,
					title: milestone.title,
					weeks: milestone.weeks,
					description: milestone.description,
					output: milestone.output,
					icon: milestone.icon as ProgramJourneyIcon,
					tools
				};
			})
		);

		const plans = (
			await Promise.all(
				offerings.map(async (offering) => {
					const benefits = await db
						.select({ content: programOfferingBenefit.content })
						.from(programOfferingBenefit)
						.where(eq(programOfferingBenefit.offeringId, offering.id))
						.orderBy(asc(programOfferingBenefit.position));

					if (offering.type === 'private') {
						const schedules = await db
							.select({ content: programOfferingSchedule.content })
							.from(programOfferingSchedule)
							.where(eq(programOfferingSchedule.offeringId, offering.id))
							.orderBy(asc(programOfferingSchedule.position));
						return [
							{
								id: offering.id,
								name: offering.name,
								badge: offering.badge || 'Private',
								title: offering.title,
								price: formatRupiah(offering.priceAmount),
								schedule: schedules.map((item) => item.content),
								benefits: benefits.map((item) => item.content),
								ctaLabel: 'Daftar Sekarang',
								ctaUrl: `/register?program=${row.slug}&offering=${offering.slug}`,
								type: 'private' as const,
								scheduleInfo: null
							}
						];
					}

					const batches = await db
						.select()
						.from(programBatch)
						.where(and(eq(programBatch.offeringId, offering.id), eq(programBatch.isOpen, true)))
						.orderBy(asc(programBatch.startDate))
						.limit(1);

					if (!batches.length) return [];

					const batch = batches[0];
					const schedules = await db
						.select()
						.from(batchSchedule)
						.where(eq(batchSchedule.batchId, batch.id))
						.orderBy(asc(batchSchedule.dayOfWeek), asc(batchSchedule.startTime));
					const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
					const scheduleInfo = {
						days: schedules.map((s) => DAYS_ID[s.dayOfWeek] ?? 'Hari'),
						time:
							schedules.length > 0
								? `${schedules[0].startTime.slice(0, 5)} - ${schedules[0].endTime.slice(0, 5)} WIB`
								: null,
						startPeriod: batch.startDate ? formatPeriod(batch.startDate) : null,
						endPeriod: batch.endDate ? formatPeriod(batch.endDate) : null,
						locationType: batch.locationType as 'remote' | 'onsite',
						location: batch.location ?? null
					};

					return [
						{
							id: batch.id,
							name: offering.name,
							badge: batch.title,
							title: offering.title,
							price: formatRupiah(offering.priceAmount),
							schedule: [
								...schedules.map(formatBatchSchedule),
								formatDateRange(batch.startDate, batch.endDate)
							].filter(Boolean),
							benefits: benefits.map((item) => item.content),
							ctaLabel: 'Daftar Sekarang',
							ctaUrl: `/register?program=${row.slug}&offering=${offering.slug}`,
							type: 'batch' as const,
							scheduleInfo
						}
					];
				})
			)
		).flat();

		return {
			slug: row.slug,
			title: row.title,
			summary: row.summary,
			seoTitle: row.title,
			seoDescription: row.summary,
			eyebrow: row.eyebrow,
			heroImage: row.heroImage,
			heroImageAlt: row.heroImageAlt,
			metrics: metrics.map((item) => ({
				label: item.label,
				value: item.value,
				icon: item.icon as ProgramMetricIcon
			})),
			intro: {
				eyebrow: introRow?.introEyebrow ?? '',
				title: introRow?.introTitle ?? '',
				image: introRow?.introImage ?? '',
				imageAlt: introRow?.introImageAlt ?? '',
				deskripsi: introRow?.deskripsi ?? [],
				learningBackground: introRow?.learningBackground ?? []
			},
			journey: {
				title: 'Peta Perjalanan Belajarmu',
				subtitle: 'Kurikulum bertahap dari fondasi sampai proyek akhir siap portofolio.',
				stages: journeyStages
			},
			pricing: { title: '', subtitle: '', plans }
		};
	}

	static async getRegistrationSelection(
		programSlug: string,
		offeringSlug: string,
		batchSlug?: string
	) {
		const [selection] = await db
			.select({
				programId: program.id,
				programSlug: program.slug,
				programTitle: program.title,
				offeringId: programOffering.id,
				offeringSlug: programOffering.slug,
				offeringName: programOffering.name,
				offeringTitle: programOffering.title,
				offeringType: programOffering.type,
				priceAmount: programOffering.priceAmount
			})
			.from(programOffering)
			.innerJoin(program, eq(program.id, programOffering.programId))
			.where(
				and(
					eq(program.slug, programSlug),
					eq(programOffering.slug, offeringSlug),
					eq(program.status, 'published'),
					eq(program.isActive, true),
					eq(programOffering.isActive, true)
				)
			)
			.limit(1);
		if (!selection) return null;

		if (selection.offeringType === 'private') {
			const schedules = await db
				.select({ content: programOfferingSchedule.content })
				.from(programOfferingSchedule)
				.where(eq(programOfferingSchedule.offeringId, selection.offeringId))
				.orderBy(asc(programOfferingSchedule.position));
			return {
				...selection,
				batchId: null,
				batchSlug: null,
				batchTitle: 'Private',
				schedule: schedules.map((item) => item.content),
				price: formatRupiah(selection.priceAmount)
			};
		}

		if (!batchSlug) {
			// Auto-pick the latest open batch
			const [latestBatch] = await db
				.select()
				.from(programBatch)
				.where(
					and(eq(programBatch.offeringId, selection.offeringId), eq(programBatch.isOpen, true))
				)
				.orderBy(asc(programBatch.startDate))
				.limit(1);
			if (!latestBatch) return null;
			const schedules = await db
				.select()
				.from(batchSchedule)
				.where(eq(batchSchedule.batchId, latestBatch.id))
				.orderBy(asc(batchSchedule.dayOfWeek), asc(batchSchedule.startTime));
			return {
				...selection,
				batchId: latestBatch.id,
				batchSlug: latestBatch.slug,
				batchTitle: latestBatch.title,
				schedule: [
					...schedules.map(formatBatchSchedule),
					formatDateRange(latestBatch.startDate, latestBatch.endDate)
				].filter(Boolean),
				price: formatRupiah(selection.priceAmount)
			};
		}

		const [batch] = await db
			.select()
			.from(programBatch)
			.where(
				and(
					eq(programBatch.offeringId, selection.offeringId),
					eq(programBatch.slug, batchSlug),
					eq(programBatch.isOpen, true)
				)
			)
			.limit(1);
		if (!batch) return null;
		const schedules = await db
			.select()
			.from(batchSchedule)
			.where(eq(batchSchedule.batchId, batch.id))
			.orderBy(asc(batchSchedule.dayOfWeek), asc(batchSchedule.startTime));
		return {
			...selection,
			batchId: batch.id,
			batchSlug: batch.slug,
			batchTitle: batch.title,
			schedule: [
				...schedules.map(formatBatchSchedule),
				formatDateRange(batch.startDate, batch.endDate)
			].filter(Boolean),
			price: formatRupiah(selection.priceAmount)
		};
	}

	// ==================== PROGRAM CRUD ====================

	static async getAllPrograms(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		sort?: string;
		order?: string;
	}) {
		const { search, page = 1, pageSize = 10, sort = 'title', order = 'asc' } = params;
		const offset = (page - 1) * pageSize;

		const whereClause = search
			? or(ilike(program.title, `%${search}%`), ilike(program.slug, `%${search}%`))
			: undefined;

		const sortMap: Record<string, PgColumn> = {
			title: program.title,
			slug: program.slug,
			status: program.status,
			isActive: program.isActive,
			createdAt: program.createdAt
		};
		const sortCol = sortMap[sort] || program.title;
		const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

		const [rows, totalResult] = await Promise.all([
			db.select().from(program).where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(program)
				.where(whereClause)
		]);

		return { programs: rows, total: Number(totalResult[0]?.count ?? 0) };
	}

	static async getProgramById(id: string) {
		const [row] = await db.select().from(program).where(eq(program.id, id)).limit(1);
		return row ?? null;
	}

	static async toggleProgramActive(id: string, isActive: boolean) {
		await db.update(program).set({ isActive, updatedAt: new Date() }).where(eq(program.id, id));
	}

	static async getProgramDetail(id: string) {
		const [row] = await db.select().from(program).where(eq(program.id, id)).limit(1);
		if (!row) return null;

		const programId = row.id;
		const [introRow, metrics, milestones, offerings] = await Promise.all([
			db
				.select()
				.from(programIntro)
				.where(eq(programIntro.programId, programId))
				.limit(1)
				.then((r) => r[0] ?? null),
			db
				.select()
				.from(programMetric)
				.where(eq(programMetric.programId, programId))
				.orderBy(asc(programMetric.position)),
			db
				.select()
				.from(programMilestone)
				.where(eq(programMilestone.programId, programId))
				.orderBy(asc(programMilestone.position)),
			db
				.select()
				.from(programOffering)
				.where(eq(programOffering.programId, programId))
				.orderBy(asc(programOffering.name))
		]);

		const milestonesWithTech = await Promise.all(
			milestones.map(async (m) => {
				const techs = await db
					.select({ name: technology.name, iconKey: technology.iconKey })
					.from(milestoneTechnology)
					.innerJoin(technology, eq(technology.id, milestoneTechnology.technologyId))
					.where(eq(milestoneTechnology.milestoneId, m.id))
					.orderBy(asc(milestoneTechnology.position));
				return { ...m, technologies: techs };
			})
		);

		const offeringsDetail = await Promise.all(
			offerings.map(async (o) => {
				const [benefits, schedules, batches] = await Promise.all([
					db
						.select({
							content: programOfferingBenefit.content,
							position: programOfferingBenefit.position
						})
						.from(programOfferingBenefit)
						.where(eq(programOfferingBenefit.offeringId, o.id))
						.orderBy(asc(programOfferingBenefit.position)),
					db
						.select({
							content: programOfferingSchedule.content,
							position: programOfferingSchedule.position
						})
						.from(programOfferingSchedule)
						.where(eq(programOfferingSchedule.offeringId, o.id))
						.orderBy(asc(programOfferingSchedule.position)),
					db
						.select()
						.from(programBatch)
						.where(eq(programBatch.offeringId, o.id))
						.orderBy(asc(programBatch.title))
				]);
				return { ...o, benefits, schedules, batches };
			})
		);

		return {
			...row,
			intro: introRow,
			metrics,
			milestones: milestonesWithTech,
			offerings: offeringsDetail
		};
	}

	static async createProgram(data: CreateProgramDTO) {
		const id = crypto.randomUUID();
		await db.insert(program).values({
			id,
			slug: data.slug,
			title: data.title,
			summary: data.summary,
			eyebrow: data.eyebrow,
			heroImage: data.heroImage as string,
			heroImageAlt: data.heroImageAlt,
			status: data.status
		});
		return id;
	}

	static async updateProgram(data: UpdateProgramDTO) {
		const [existing] = await db.select().from(program).where(eq(program.id, data.id)).limit(1);
		if (!existing) throw new Error('Program tidak ditemukan');

		await db
			.update(program)
			.set({
				slug: data.slug,
				title: data.title,
				summary: data.summary,
				eyebrow: data.eyebrow,
				heroImage: String(data.heroImage ?? existing.heroImage),
				heroImageAlt: data.heroImageAlt,
				status: data.status,
				updatedAt: new Date()
			})
			.where(eq(program.id, data.id));
	}

	static async deleteProgram(id: string) {
		await db.delete(program).where(eq(program.id, id));
	}

	static async bulkDeletePrograms(ids: string[]) {
		for (const id of ids) {
			await this.deleteProgram(id);
		}
	}

	// ==================== BATCH CRUD ====================

	static async getAllBatches(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		sort?: string;
		order?: string;
	}) {
		const { search, page = 1, pageSize = 10, sort = 'title', order = 'asc' } = params;
		const offset = (page - 1) * pageSize;

		const baseQuery = db
			.select({
				id: programBatch.id,
				offeringId: programBatch.offeringId,
				slug: programBatch.slug,
				title: programBatch.title,
				registrationOpenAt: programBatch.registrationOpenAt,
				registrationCloseAt: programBatch.registrationCloseAt,
				startDate: programBatch.startDate,
				endDate: programBatch.endDate,
				capacity: programBatch.capacity,
				isOpen: programBatch.isOpen,
				locationType: programBatch.locationType,
				location: programBatch.location,
				programTitle: program.title,
				offeringName: programOffering.name,
				createdAt: programBatch.createdAt,
				updatedAt: programBatch.updatedAt
			})
			.from(programBatch)
			.innerJoin(programOffering, eq(programOffering.id, programBatch.offeringId))
			.innerJoin(program, eq(program.id, programOffering.programId));

		const whereClause = search
			? or(
					ilike(programBatch.title, `%${search}%`),
					ilike(program.title, `%${search}%`),
					ilike(programOffering.name, `%${search}%`)
				)
			: undefined;

		const sortMap: Record<string, PgColumn> = {
			title: programBatch.title,
			programTitle: program.title,
			offeringName: programOffering.name,
			isOpen: programBatch.isOpen,
			startDate: programBatch.startDate,
			capacity: programBatch.capacity,
			createdAt: programBatch.createdAt
		};
		const sortCol = sortMap[sort] || programBatch.title;
		const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

		const [rows, totalResult] = await Promise.all([
			baseQuery.where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(programBatch)
				.where(whereClause)
		]);

		const batches = await Promise.all(
			rows.map(async (row) => {
				const schedules = await db
					.select({
						dayOfWeek: batchSchedule.dayOfWeek,
						startTime: batchSchedule.startTime,
						endTime: batchSchedule.endTime
					})
					.from(batchSchedule)
					.where(eq(batchSchedule.batchId, row.id))
					.orderBy(asc(batchSchedule.dayOfWeek), asc(batchSchedule.startTime));

				return {
					...row,
					schedules,
					dayText: formatList(
						schedules
							.map((schedule) => formatBatchDay(schedule.dayOfWeek))
							.filter((day, index, days) => days.indexOf(day) === index)
					),
					timeText: schedules
						.map((schedule) => formatBatchTime(schedule.startTime, schedule.endTime))
						.filter((time, index, times) => times.indexOf(time) === index)
						.join(', ')
				};
			})
		);

		return { batches, total: Number(totalResult[0]?.count ?? 0) };
	}

	static async getBatchById(id: string) {
		const [row] = await db
			.select({
				id: programBatch.id,
				offeringId: programBatch.offeringId,
				slug: programBatch.slug,
				title: programBatch.title,
				registrationOpenAt: programBatch.registrationOpenAt,
				registrationCloseAt: programBatch.registrationCloseAt,
				startDate: programBatch.startDate,
				endDate: programBatch.endDate,
				capacity: programBatch.capacity,
				isOpen: programBatch.isOpen,
				locationType: programBatch.locationType,
				location: programBatch.location
			})
			.from(programBatch)
			.where(eq(programBatch.id, id))
			.limit(1);
		if (!row) return null;

		const schedules = await db
			.select({
				dayOfWeek: batchSchedule.dayOfWeek,
				startTime: batchSchedule.startTime,
				endTime: batchSchedule.endTime
			})
			.from(batchSchedule)
			.where(eq(batchSchedule.batchId, id))
			.orderBy(asc(batchSchedule.dayOfWeek), asc(batchSchedule.startTime));

		return { ...row, schedules };
	}

	static async createBatch(data: CreateBatchDTO) {
		const id = crypto.randomUUID();
		await db.transaction(async (tx) => {
			await tx.insert(programBatch).values({
				id,
				offeringId: data.offeringId,
				slug: data.slug,
				title: data.title,
				registrationOpenAt: data.registrationOpenAt ? new Date(data.registrationOpenAt) : null,
				registrationCloseAt: data.registrationCloseAt ? new Date(data.registrationCloseAt) : null,
				startDate: data.startDate ?? null,
				endDate: data.endDate ?? null,
				capacity: data.capacity ?? null,
				isOpen: data.isOpen,
				locationType: data.locationType,
				location: data.location ?? null
			});

			if (data.days.length > 0) {
				await tx.insert(batchSchedule).values(
					data.days.map((dayOfWeek) => ({
						id: crypto.randomUUID(),
						batchId: id,
						dayOfWeek,
						startTime: data.startTime,
						endTime: data.endTime
					}))
				);
			}
		});
		return id;
	}

	static async updateBatch(data: UpdateBatchDTO) {
		const [existing] = await db
			.select()
			.from(programBatch)
			.where(eq(programBatch.id, data.id))
			.limit(1);
		if (!existing) throw new Error('Batch tidak ditemukan');

		await db.transaction(async (tx) => {
			await tx
				.update(programBatch)
				.set({
					offeringId: data.offeringId,
					slug: data.slug,
					title: data.title,
					registrationOpenAt: data.registrationOpenAt ? new Date(data.registrationOpenAt) : null,
					registrationCloseAt: data.registrationCloseAt ? new Date(data.registrationCloseAt) : null,
					startDate: data.startDate ?? null,
					endDate: data.endDate ?? null,
					capacity: data.capacity ?? null,
					isOpen: data.isOpen,
					locationType: data.locationType,
					location: data.location ?? null,
					updatedAt: new Date()
				})
				.where(eq(programBatch.id, data.id));

			await tx.delete(batchSchedule).where(eq(batchSchedule.batchId, data.id));

			if (data.days.length > 0) {
				await tx.insert(batchSchedule).values(
					data.days.map((dayOfWeek) => ({
						id: crypto.randomUUID(),
						batchId: data.id,
						dayOfWeek,
						startTime: data.startTime,
						endTime: data.endTime
					}))
				);
			}
		});
	}

	static async deleteBatch(id: string) {
		await db.delete(programBatch).where(eq(programBatch.id, id));
	}

	static async bulkDeleteBatches(ids: string[]) {
		for (const id of ids) {
			await this.deleteBatch(id);
		}
	}

	// ==================== ENROLLMENT CRUD ====================

	static async getAllEnrollments(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		sort?: string;
		order?: string;
	}) {
		const { search, page = 1, pageSize = 10, sort = 'createdAt', order = 'desc' } = params;
		const offset = (page - 1) * pageSize;

		const baseSelect = {
			id: enrollment.id,
			studentId: enrollment.studentId,
			offeringId: enrollment.offeringId,
			batchId: enrollment.batchId,
			motivation: enrollment.motivation,
			referralSource: enrollment.referralSource,
			hasProgrammingBasics: enrollment.hasProgrammingBasics,
			usesAiTools: enrollment.usesAiTools,
			status: enrollment.status,
			studentName: student.fullName,
			email: user.email,
			programTitle: program.title,
			offeringName: programOffering.name,
			batchTitle: programBatch.title,
			createdAt: enrollment.createdAt,
			updatedAt: enrollment.updatedAt
		};

		const baseQuery = db
			.select(baseSelect)
			.from(enrollment)
			.innerJoin(student, eq(student.id, enrollment.studentId))
			.innerJoin(user, eq(user.id, student.userId))
			.innerJoin(programOffering, eq(programOffering.id, enrollment.offeringId))
			.innerJoin(program, eq(program.id, programOffering.programId))
			.leftJoin(programBatch, eq(programBatch.id, enrollment.batchId));

		const whereClause = search
			? or(
					ilike(student.fullName, `%${search}%`),
					ilike(user.email, `%${search}%`),
					ilike(program.title, `%${search}%`),
					ilike(programOffering.name, `%${search}%`),
					ilike(programBatch.title, `%${search}%`),
					ilike(enrollment.status, `%${search}%`)
				)
			: undefined;

		const sortMap: Record<string, PgColumn> = {
			status: enrollment.status,
			programTitle: program.title,
			offeringName: programOffering.name,
			createdAt: enrollment.createdAt
		};
		const sortCol = sortMap[sort] || enrollment.createdAt;
		const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

		const [rows, totalResult] = await Promise.all([
			baseQuery.where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(enrollment)
				.where(whereClause)
		]);

		return { enrollments: rows, total: Number(totalResult[0]?.count ?? 0) };
	}

	static async getEnrollmentById(id: string) {
		const [row] = await db
			.select({
				id: enrollment.id,
				studentId: enrollment.studentId,
				offeringId: enrollment.offeringId,
				batchId: enrollment.batchId,
				motivation: enrollment.motivation,
				referralSource: enrollment.referralSource,
				hasProgrammingBasics: enrollment.hasProgrammingBasics,
				usesAiTools: enrollment.usesAiTools,
				status: enrollment.status
			})
			.from(enrollment)
			.where(eq(enrollment.id, id))
			.limit(1);
		return row ?? null;
	}

	static async createEnrollment(data: CreateEnrollmentDTO) {
		const id = crypto.randomUUID();
		await db.insert(enrollment).values({
			id,
			studentId: data.studentId,
			offeringId: data.offeringId,
			batchId: data.batchId ?? null,
			motivation: data.motivation,
			referralSource: data.referralSource,
			hasProgrammingBasics: data.hasProgrammingBasics,
			usesAiTools: data.usesAiTools,
			status: data.status
		});
		return id;
	}

	static async updateEnrollment(data: UpdateEnrollmentDTO) {
		const [existing] = await db
			.select()
			.from(enrollment)
			.where(eq(enrollment.id, data.id))
			.limit(1);
		if (!existing) throw new Error('Enrollment tidak ditemukan');

		await db
			.update(enrollment)
			.set({
				studentId: data.studentId,
				offeringId: data.offeringId,
				batchId: data.batchId ?? null,
				motivation: data.motivation,
				referralSource: data.referralSource,
				hasProgrammingBasics: data.hasProgrammingBasics,
				usesAiTools: data.usesAiTools,
				status: data.status,
				updatedAt: new Date()
			})
			.where(eq(enrollment.id, data.id));
	}

	static async deleteEnrollment(id: string) {
		await db.delete(enrollment).where(eq(enrollment.id, id));
	}

	static async bulkDeleteEnrollments(ids: string[]) {
		for (const id of ids) {
			await this.deleteEnrollment(id);
		}
	}

	// ==================== MILESTONE ====================

	static async getAllMilestones(params: {
		search?: string;
		page?: number;
		pageSize?: number;
		sort?: string;
		order?: string;
	}) {
		const { search, page = 1, pageSize = 10, sort = 'position', order = 'asc' } = params;
		const offset = (page - 1) * pageSize;

		const baseQuery = db
			.select({
				id: programMilestone.id,
				programId: programMilestone.programId,
				title: programMilestone.title,
				weeks: programMilestone.weeks,
				icon: programMilestone.icon,
				position: programMilestone.position,
				programTitle: program.title
			})
			.from(programMilestone)
			.innerJoin(program, eq(program.id, programMilestone.programId));

		const whereClause = search
			? or(ilike(programMilestone.title, `%${search}%`), ilike(program.title, `%${search}%`))
			: undefined;

		const sortMap: Record<string, PgColumn> = {
			title: programMilestone.title,
			position: programMilestone.position,
			programTitle: program.title
		};
		const sortCol = sortMap[sort] || programMilestone.position;
		const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

		const [rows, totalResult] = await Promise.all([
			baseQuery.where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(programMilestone)
				.where(whereClause)
		]);

		return { milestones: rows, total: Number(totalResult[0]?.count ?? 0) };
	}

	static async getMilestonesByProgramId(programId: string) {
		const milestones = await db
			.select()
			.from(programMilestone)
			.where(eq(programMilestone.programId, programId))
			.orderBy(asc(programMilestone.position));

		const milestonesWithTech = await Promise.all(
			milestones.map(async (m) => {
				const techs = await db
					.select({ id: technology.id, name: technology.name, iconKey: technology.iconKey })
					.from(milestoneTechnology)
					.innerJoin(technology, eq(technology.id, milestoneTechnology.technologyId))
					.where(eq(milestoneTechnology.milestoneId, m.id))
					.orderBy(asc(milestoneTechnology.position));
				return { ...m, technologyIds: techs.map((t) => t.id.replace('technology-', '')) };
			})
		);

		return milestonesWithTech;
	}

	static async saveMilestones(
		programId: string,
		milestones: Array<{
			title: string;
			weeks: string;
			description: string;
			output: string;
			icon?: string;
			technologyIds: string[];
		}>
	) {
		await db.transaction(async (tx) => {
			await tx.delete(programMilestone).where(eq(programMilestone.programId, programId));

			for (let i = 0; i < milestones.length; i++) {
				const { technologyIds, ...data } = milestones[i];
				const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15)));

				await tx.insert(programMilestone).values({
					id,
					programId,
					title: data.title,
					weeks: data.weeks,
					description: data.description,
					output: data.output,
					icon: data.icon ?? 'foundation',
					position: i + 1
				});

				if (technologyIds.length > 0) {
					const dbTechIds = await Promise.all(
						technologyIds.map(async (slug) => {
							const dbId = `technology-${slug}`;
							await tx
								.insert(technology)
								.values({
									id: dbId,
									slug,
									name: slug,
									iconKey: slug,
									isActive: true
								})
								.onConflictDoUpdate({
									target: technology.slug,
									set: { name: slug, iconKey: slug, isActive: true }
								});
							return dbId;
						})
					);

					await tx.insert(milestoneTechnology).values(
						dbTechIds.map((techId, index) => ({
							milestoneId: id,
							technologyId: techId,
							position: index
						}))
					);
				}
			}
		});
	}

	static async getFirstRegistrationUrl() {
		const navigation = await this.getPublicNavigation();
		for (const item of navigation.programs) {
			const [offering] = await db
				.select()
				.from(programOffering)
				.where(and(eq(programOffering.programId, item.id), eq(programOffering.isActive, true)))
				.limit(1);
			if (!offering) continue;
			if (offering.type === 'private') {
				return `/register?program=${item.slug}&offering=${offering.slug}`;
			}
			const [batch] = await db
				.select()
				.from(programBatch)
				.where(and(eq(programBatch.offeringId, offering.id), eq(programBatch.isOpen, true)))
				.limit(1);
			if (batch) {
				return `/register?program=${item.slug}&offering=${offering.slug}&batch=${batch.slug}`;
			}
		}
		return '/';
	}

	// ==================== INTRO UPSERT ====================

	static async upsertIntro(data: UpsertIntroDTO) {
		const [existing] = await db
			.select()
			.from(programIntro)
			.where(eq(programIntro.programId, data.programId))
			.limit(1);

		if (existing) {
			await db
				.update(programIntro)
				.set({
					introEyebrow: data.introEyebrow,
					introTitle: data.introTitle,
					introImage: String(data.introImage),
					introImageAlt: data.introImageAlt,
					deskripsi: data.deskripsi,
					learningBackground: data.learningBackground
				})
				.where(eq(programIntro.id, existing.id));
		} else {
			await db.insert(programIntro).values({
				id: crypto.randomUUID(),
				programId: data.programId,
				introEyebrow: data.introEyebrow,
				introTitle: data.introTitle,
				introImage: String(data.introImage),
				introImageAlt: data.introImageAlt,
				deskripsi: data.deskripsi,
				learningBackground: data.learningBackground
			});
		}
	}

	// ==================== METRIC CRUD ====================

	static async getMetricsByProgramId(programId: string) {
		return db
			.select()
			.from(programMetric)
			.where(eq(programMetric.programId, programId))
			.orderBy(asc(programMetric.position));
	}

	static async createMetric(data: CreateMetricDTO) {
		const id = crypto.randomUUID();
		await db.insert(programMetric).values({
			id,
			programId: data.programId,
			label: data.label,
			value: data.value,
			icon: data.icon,
			position: data.position
		});
		return id;
	}

	static async updateMetric(data: UpdateMetricDTO) {
		await db
			.update(programMetric)
			.set({
				programId: data.programId,
				label: data.label,
				value: data.value,
				icon: data.icon,
				position: data.position
			})
			.where(eq(programMetric.id, data.id));
	}

	static async deleteMetric(id: string) {
		await db.delete(programMetric).where(eq(programMetric.id, id));
	}

	// ==================== BULK SAVE METHODS ====================

	static async getOfferingsByProgramId(programId: string) {
		const offerings = await db
			.select()
			.from(programOffering)
			.where(eq(programOffering.programId, programId))
			.orderBy(asc(programOffering.name));

		return Promise.all(
			offerings.map(async (o) => {
				const [benefits, schedules, batches] = await Promise.all([
					db
						.select({
							content: programOfferingBenefit.content,
							position: programOfferingBenefit.position
						})
						.from(programOfferingBenefit)
						.where(eq(programOfferingBenefit.offeringId, o.id))
						.orderBy(asc(programOfferingBenefit.position)),
					db
						.select({
							content: programOfferingSchedule.content,
							position: programOfferingSchedule.position
						})
						.from(programOfferingSchedule)
						.where(eq(programOfferingSchedule.offeringId, o.id))
						.orderBy(asc(programOfferingSchedule.position)),
					db
						.select()
						.from(programBatch)
						.where(eq(programBatch.offeringId, o.id))
						.orderBy(asc(programBatch.title))
				]);
				return { ...o, benefits, schedules, batches };
			})
		);
	}

	static async saveMetrics(
		programId: string,
		metrics: Array<{ label: string; value: string; icon: string; position?: number }>
	) {
		await db.transaction(async (tx) => {
			await tx.delete(programMetric).where(eq(programMetric.programId, programId));
			if (metrics.length === 0) return;
			await tx.insert(programMetric).values(
				metrics.map((m, i) => ({
					id: crypto.randomUUID(),
					programId,
					label: m.label,
					value: m.value,
					icon: m.icon,
					position: m.position ?? i + 1
				}))
			);
		});
	}

	// ==================== FAQ CRUD ====================

	static async getFaqs() {
		return db
			.select({
				id: programFaq.id,
				question: programFaq.question,
				answer: programFaq.answer,
				position: programFaq.position,
				isActive: programFaq.isActive
			})
			.from(programFaq)
			.orderBy(asc(programFaq.position));
	}

	static async saveFaqs(faqs: Array<{ question: string; answer: string }>) {
		await db.transaction(async (tx) => {
			await tx.delete(programFaq);
			if (faqs.length > 0) {
				await tx.insert(programFaq).values(
					faqs.map((f, i) => ({
						id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15))),
						question: f.question,
						answer: f.answer,
						position: i + 1,
						isActive: true
					}))
				);
			}
		});
	}

	// ==================== SOCIAL LINKS CRUD ====================

	static async getSocialLinks() {
		return db
			.select({
				id: socialLink.id,
				platform: socialLink.platform,
				url: socialLink.url,
				iconKey: socialLink.iconKey,
				position: socialLink.position,
				isActive: socialLink.isActive
			})
			.from(socialLink)
			.orderBy(asc(socialLink.position));
	}

	static async saveSocialLinks(links: Array<{ platform: string; url: string; iconKey: string }>) {
		await db.transaction(async (tx) => {
			await tx.delete(socialLink);
			if (links.length > 0) {
				await tx.insert(socialLink).values(
					links.map((l, i) => ({
						id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15))),
						platform: l.platform,
						url: l.url,
						iconKey: l.iconKey,
						position: i + 1,
						isActive: true
					}))
				);
			}
		});
	}
}

function formatRupiah(value: number) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(value);
}

function formatDateRange(start: string | null, end: string | null) {
	if (!start && !end) return '';
	const format = (value: string) =>
		new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
			new Date(`${value}T00:00:00`)
		);
	if (start && end) return `${format(start)} - ${format(end)}`;
	return format((start || end)!);
}

function formatBatchSchedule(value: { dayOfWeek: number; startTime: string; endTime: string }) {
	return `${formatBatchDay(value.dayOfWeek)} ${formatBatchTime(value.startTime, value.endTime)}`;
}

function formatBatchDay(dayOfWeek: number) {
	const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	return days[dayOfWeek] ?? 'Hari';
}

function formatBatchTime(startTime: string, endTime: string) {
	return `${startTime.slice(0, 5)}-${endTime.slice(0, 5)} WIB`;
}

function formatList(values: string[]) {
	if (values.length < 2) return values[0] ?? '';
	if (values.length === 2) return `${values[0]} & ${values[1]}`;
	return `${values.slice(0, -1).join(', ')}, & ${values.at(-1)}`;
}

function formatPeriod(value: string) {
	return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
		new Date(`${value}T00:00:00`)
	);
}
