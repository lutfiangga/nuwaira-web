import { db } from '$lib/app/database';
import {
	batchSchedule,
	milestoneTechnology,
	facility,
	program,
	programAudienceBenefit,
	programFaq,
	programBatch,
	programIntro,
	programMetric,
	programMilestone,
	programOffering,
	programOfferingBenefit,
	programOfferingSchedule,
	publicEvent,
	registrationPerk,
	socialLink,
	technology,
	user
} from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';
import { TECHNOLOGY_CATALOG } from '$lib/program-technologies';
import { eq } from 'drizzle-orm';
import { EVENT_SEED_DATA, PROGRAM_SEED_DATA, PROGRAM_SHARED_SEED_DATA } from './data/programs';

export class DatabaseSeeder {
	static async seedUsers() {
		const existingAdmin = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, 'admin@nuwaira.id'))
			.limit(1);
		if (existingAdmin.length) return 'Users already seeded.';

		await db.insert(user).values({
			id: crypto.randomUUID(),
			email: 'admin@nuwaira.id',
			role: 'admin',
			name: 'Admin',
			passwordHash: await hashPassword('password')
		});
		return 'Seeded admin user.';
	}

	static async seedPrograms() {
		await db.transaction(async (tx) => {
			for (const item of TECHNOLOGY_CATALOG) {
				await tx
					.insert(technology)
					.values({
						id: `technology-${item.key}`,
						slug: item.key,
						name: item.name,
						iconKey: item.key,
						isActive: true
					})
					.onConflictDoUpdate({
						target: technology.slug,
						set: { name: item.name, iconKey: item.key, isActive: true }
					});
			}

			for (const config of PROGRAM_SEED_DATA) {
				const programId = `program-${config.slug}`;
				await tx
					.insert(program)
					.values({
						id: programId,
						slug: config.slug,
						title: config.title,
						summary: config.summary,
						eyebrow: config.eyebrow,
						heroImage: config.heroImage,
						heroImageAlt: config.heroImageAlt,
						status: 'published',
						isActive: true
					})
					.onConflictDoUpdate({
						target: program.slug,
						set: {
							title: config.title,
							summary: config.summary,
							eyebrow: config.eyebrow,
							heroImage: config.heroImage,
							heroImageAlt: config.heroImageAlt,
							status: 'published',
							isActive: true,
							updatedAt: new Date()
						}
					});

				// Upsert program intro
				await tx.delete(programIntro).where(eq(programIntro.programId, programId));
				await tx.insert(programIntro).values({
					id: `intro-${config.slug}`,
					programId,
					introEyebrow: config.intro.eyebrow,
					introTitle: config.intro.title,
					introImage: config.intro.image,
					introImageAlt: config.intro.imageAlt,
					deskripsi: [...config.intro.paragraphs],
					learningBackground: [...config.intro.checklist]
				});

				await tx.delete(programMetric).where(eq(programMetric.programId, programId));
				await tx.delete(programMilestone).where(eq(programMilestone.programId, programId));

				await tx.insert(programMetric).values(
					config.metrics.map((item, index) => ({
						id: `metric-${config.slug}-${index + 1}`,
						programId,
						label: item.label,
						value: item.value,
						icon: item.icon,
						position: index + 1
					}))
				);

				for (const [index, stage] of config.milestones.entries()) {
					const milestoneId = `milestone-${config.slug}-${index + 1}`;
					await tx.insert(programMilestone).values({
						id: milestoneId,
						programId,
						title: stage.title,
						weeks: stage.weeks,
						description: stage.description,
						output: stage.output,
						icon: stage.icon,
						position: index + 1
					});
					await tx.insert(milestoneTechnology).values(
						stage.technologies.map((key, toolIndex) => ({
							milestoneId,
							technologyId: `technology-${key}`,
							position: toolIndex
						}))
					);
				}

				for (const offeringData of config.offerings) {
					const offeringId = `offering-${config.slug}-${offeringData.slug}`;
					await tx
						.insert(programOffering)
						.values({
							id: offeringId,
							programId,
							slug: offeringData.slug,
							type: offeringData.type,
							name: offeringData.name,
							title: offeringData.title,
							priceAmount: offeringData.priceAmount,
							currency: 'IDR',
							badge: offeringData.badge,
							isActive: true
						})
						.onConflictDoUpdate({
							target: [programOffering.programId, programOffering.slug],
							set: {
								name: offeringData.name,
								title: offeringData.title,
								priceAmount: offeringData.priceAmount,
								badge: offeringData.badge,
								isActive: true,
								updatedAt: new Date()
							}
						});

					await tx
						.delete(programOfferingBenefit)
						.where(eq(programOfferingBenefit.offeringId, offeringId));
					await tx
						.delete(programOfferingSchedule)
						.where(eq(programOfferingSchedule.offeringId, offeringId));
					await tx.insert(programOfferingBenefit).values(
						offeringData.benefits.map((content, index) => ({
							id: `offering-benefit-${config.slug}-${offeringData.slug}-${index + 1}`,
							offeringId,
							content,
							position: index + 1
						}))
					);

					if (offeringData.type === 'private') {
						await tx.insert(programOfferingSchedule).values(
							offeringData.schedules.map((content, index) => ({
								id: `offering-schedule-${config.slug}-${offeringData.slug}-${index + 1}`,
								offeringId,
								content,
								position: index + 1
							}))
						);
					} else {
						for (const batch of offeringData.batches) {
							const batchId = `batch-${config.slug}-${offeringData.slug}-${batch.slug}`;
							const [savedBatch] = await tx
								.insert(programBatch)
								.values({
									id: batchId,
									offeringId,
									slug: batch.slug,
									title: batch.title,
									registrationOpenAt: batch.registrationOpenAt,
									registrationCloseAt: batch.registrationCloseAt,
									startDate: batch.startDate,
									endDate: batch.endDate,
									capacity: batch.capacity,
									isOpen: batch.isOpen,
									locationType: batch.locationType,
									location: batch.location
								})
								.onConflictDoUpdate({
									target: [programBatch.offeringId, programBatch.slug],
									set: {
										title: batch.title,
										registrationOpenAt: batch.registrationOpenAt,
										registrationCloseAt: batch.registrationCloseAt,
										startDate: batch.startDate,
										endDate: batch.endDate,
										capacity: batch.capacity,
										isOpen: batch.isOpen,
										locationType: batch.locationType,
										location: batch.location,
										updatedAt: new Date()
									}
								})
								.returning({ id: programBatch.id });

							const savedBatchId = savedBatch?.id ?? batchId;
							await tx.delete(batchSchedule).where(eq(batchSchedule.batchId, savedBatchId));

							if (batch.startTime && batch.endTime && batch.days.length > 0) {
								await tx.insert(batchSchedule).values(
									batch.days.map((dayOfWeek) => ({
										id: `batch-schedule-${config.slug}-${offeringData.slug}-${batch.slug}-${dayOfWeek}`,
										batchId: savedBatchId,
										dayOfWeek,
										startTime: batch.startTime,
										endTime: batch.endTime,
										timezone: 'Asia/Jakarta'
									}))
								);
							}
						}
					}
				}
			}

			for (const event of EVENT_SEED_DATA) {
				await tx
					.insert(publicEvent)
					.values({ id: `event-${event.slug}`, ...event })
					.onConflictDoUpdate({
						target: publicEvent.slug,
						set: { ...event, updatedAt: new Date() }
					});
			}

			await tx.delete(programAudienceBenefit);
			await tx.delete(facility);
			await tx.delete(programFaq);
			await tx.delete(registrationPerk);
			await tx.delete(socialLink);
			await tx.insert(programAudienceBenefit).values(
				PROGRAM_SHARED_SEED_DATA.audienceBenefits.map((item, index) => ({
					id: `audience-benefit-${index + 1}`,
					...item,
					position: index + 1,
					isActive: true
				}))
			);
			await tx.insert(facility).values(
				PROGRAM_SHARED_SEED_DATA.facilities.map((item, index) => ({
					id: `facility-${index + 1}`,
					label: item.label,
					imageUrl: item.imageUrl,
					imageAlt: item.imageAlt,
					position: index + 1,
					isActive: true
				}))
			);
			await tx.insert(programFaq).values(
				PROGRAM_SHARED_SEED_DATA.faqs.map((item, index) => ({
					id: `program-faq-${index + 1}`,
					...item,
					position: index + 1,
					isActive: true
				}))
			);
			await tx.insert(registrationPerk).values(
				PROGRAM_SHARED_SEED_DATA.registrationPerks.map((item, index) => ({
					id: `registration-perk-${index + 1}`,
					...item,
					position: index + 1,
					isActive: true
				}))
			);
			await tx.insert(socialLink).values(
				PROGRAM_SHARED_SEED_DATA.socialLinks.map((item, index) => ({
					id: `social-link-${index + 1}`,
					...item,
					position: index + 1,
					isActive: true
				}))
			);
		});

		return `Seeded ${PROGRAM_SEED_DATA.length} programs and ${TECHNOLOGY_CATALOG.length} technologies.`;
	}

	static async run() {
		return {
			message: 'Seeding complete',
			users: await this.seedUsers(),
			programs: await this.seedPrograms()
		};
	}
}
