import { db } from '$lib/app/database';
import { user, student, bootcampClass, classMaterial, enrollment } from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';

export class DatabaseSeeder {
	static async seedUsers() {
		const existingUsers = await db.select().from(user).limit(1);

		if (existingUsers.length === 0) {
			const passwordHash = await hashPassword('password');
			const users: typeof user.$inferInsert[] = [
				{
					id: crypto.randomUUID(),
					username: 'superadmin',
					email: 'superadmin@nuwaira.id',
					roleId: 'superadmin',
					name: 'Super Admin',
					passwordHash
				}
			];
			await db.insert(user).values(users);
			return `Seeded ${users.length} users.`;
		}

		return 'Users already seeded.';
	}

	static async seedStudents() {
		const existingStudents = await db.select().from(student).limit(1);
		if (existingStudents.length > 0) {
			return 'Students already seeded.';
		}

		const students: typeof student.$inferInsert[] = [
			{
				id: crypto.randomUUID(),
				studentCode: 'STD-001',
				fullName: 'Ayu Pratama',
				email: 'ayu@student.id',
				phone: '081200000001',
				gender: 'female',
				track: 'personal',
				status: 'active'
			},
			{
				id: crypto.randomUUID(),
				studentCode: 'STD-002',
				fullName: 'Bima Saputra',
				email: 'bima@student.id',
				phone: '081200000002',
				gender: 'male',
				track: 'corporate',
				companyName: 'PT Contoh Teknologi',
				jobTitle: 'Software Engineer',
				status: 'active'
			}
		];

		await db.insert(student).values(students);
		return `Seeded ${students.length} students.`;
	}

	static async seedClasses() {
		const existingClasses = await db.select().from(bootcampClass).limit(1);
		if (existingClasses.length > 0) {
			return 'Classes already seeded.';
		}

		const now = new Date();
		const nextMonth = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
		const classes: typeof bootcampClass.$inferInsert[] = [
			{
				id: crypto.randomUUID(),
				code: 'CLS-TS-FUND-01',
				title: 'TypeScript Fundamentals',
				level: 'beginner',
				mode: 'online',
				mentorName: 'Lead Instructor',
				durationWeeks: 6,
				totalSessions: 12,
				price: 1500000,
				description: 'Foundational TypeScript for production web apps',
				startDate: now,
				endDate: nextMonth,
				status: 'published'
			},
			{
				id: crypto.randomUUID(),
				code: 'CLS-SK-ADV-01',
				title: 'SvelteKit Advanced Workshop',
				level: 'intermediate',
				mode: 'hybrid',
				mentorName: 'Lead Instructor',
				durationWeeks: 8,
				totalSessions: 16,
				price: 2500000,
				description: 'Production architecture, SSR patterns, and performance',
				startDate: now,
				endDate: nextMonth,
				status: 'published'
			}
		];

		await db.insert(bootcampClass).values(classes);
		return `Seeded ${classes.length} classes.`;
	}

	static async seedMaterials() {
		const existingMaterials = await db.select().from(classMaterial).limit(1);
		if (existingMaterials.length > 0) {
			return 'Materials already seeded.';
		}

		const classes = await db.select().from(bootcampClass);
		if (classes.length === 0) {
			return 'Skipped materials: no classes found.';
		}

		const materials: typeof classMaterial.$inferInsert[] = classes.flatMap((klass, classIndex) => [
			{
				id: crypto.randomUUID(),
				classId: klass.id,
				title: 'Orientation and Roadmap',
				materialType: 'topic',
				orderNo: 1,
				durationMinutes: 45,
				learningOutcome: 'Understand course structure and outcomes',
				resourceUrl: `https://example.local/materials/${classIndex + 1}/orientation`,
				isRequired: true
			},
			{
				id: crypto.randomUUID(),
				classId: klass.id,
				title: 'Hands-on Assignment 1',
				materialType: 'assignment',
				orderNo: 2,
				durationMinutes: 90,
				learningOutcome: 'Apply first module concepts in practice',
				resourceUrl: `https://example.local/materials/${classIndex + 1}/assignment-1`,
				isRequired: true
			}
		]);

		await db.insert(classMaterial).values(materials);
		return `Seeded ${materials.length} class materials.`;
	}

	static async seedEnrollments() {
		const existingEnrollments = await db.select().from(enrollment).limit(1);
		if (existingEnrollments.length > 0) {
			return 'Enrollments already seeded.';
		}

		const [students, classes] = await Promise.all([
			db.select().from(student),
			db.select().from(bootcampClass)
		]);

		if (students.length === 0 || classes.length === 0) {
			return 'Skipped enrollments: students/classes not ready.';
		}

		const enrollments: typeof enrollment.$inferInsert[] = students.map((entry, index) => ({
			id: crypto.randomUUID(),
			studentId: entry.id,
			classId: classes[index % classes.length].id,
			status: 'active',
			paymentStatus: index % 2 === 0 ? 'paid' : 'pending',
			finalScore: null,
			notes: null
		}));

		await db.insert(enrollment).values(enrollments);
		return `Seeded ${enrollments.length} enrollments.`;
	}

	static async run() {
		const userMsg = await this.seedUsers();
		const studentMsg = await this.seedStudents();
		const classMsg = await this.seedClasses();
		const materialMsg = await this.seedMaterials();
		const enrollmentMsg = await this.seedEnrollments();

		return {
			message: 'Seeding complete',
			users: userMsg,
			students: studentMsg,
			classes: classMsg,
			materials: materialMsg,
			enrollments: enrollmentMsg
		};
	}
}
