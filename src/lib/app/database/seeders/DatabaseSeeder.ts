import { db } from '$lib/app/database';
import { user } from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';
import { eq } from 'drizzle-orm';

export class DatabaseSeeder {
	static async seedUsers() {
		const existingAdmin = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, 'admin@nuwaira.id'))
			.limit(1);

		if (existingAdmin.length > 0) {
			return 'Users already seeded.';
		}

		const passwordHash = await hashPassword('password');
		const users: (typeof user.$inferInsert)[] = [
			{
				id: crypto.randomUUID(),
				email: 'admin@nuwaira.id',
				role: 'admin',
				name: 'Admin',
				passwordHash
			}
		];

		await db.insert(user).values(users);
		return `Seeded ${users.length} users.`;
	}

	static async run() {
		const userMsg = await this.seedUsers();

		return {
			message: 'Seeding complete',
			users: userMsg
		};
	}
}
