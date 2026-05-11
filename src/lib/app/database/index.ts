import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

type AppDatabase = PostgresJsDatabase<typeof schema>;

function createUnavailableDb(): AppDatabase {
	return new Proxy({} as AppDatabase, {
		get(_target, prop) {
			throw new Error(
				`Database is not configured. Set DATABASE_URL before using db.${String(prop)}().`
			);
		}
	});
}

const databaseUrl = env.DATABASE_URL?.trim();

if (!databaseUrl) {
	console.warn('[database] DATABASE_URL is not set. App will run with database disabled.');
}

const client = databaseUrl ? postgres(databaseUrl) : null;
export const db: AppDatabase = client ? drizzle(client, { schema }) : createUnavailableDb();
