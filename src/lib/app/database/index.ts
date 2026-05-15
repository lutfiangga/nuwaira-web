import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let databaseUrl = process.env.DATABASE_URL;

try {
    // Vite needs a static string to analyze the import
    // @ts-ignore
    const { env } = await import('$env/dynamic/private');
    if (env.DATABASE_URL) databaseUrl = env.DATABASE_URL;
} catch (e) {
}

if (!databaseUrl) throw new Error('DATABASE_URL is not set');

export const client = postgres(databaseUrl, {
	prepare: false,
	connect_timeout: 60
});
export const db = drizzle(client, { schema });
