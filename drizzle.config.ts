import { defineConfig } from 'drizzle-kit';

const databaseUrl =
	process.env.DATABASE_URL_MIGRATION ??
	process.env.DRIZZLE_DATABASE_URL ??
	process.env.DATABASE_URL;

if (!databaseUrl) throw new Error('DATABASE_URL_MIGRATION / DRIZZLE_DATABASE_URL / DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/app/database/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: databaseUrl },
	schemaFilter: ['public'],
	tablesFilter: ['*'],
	extensionsFilters: ['postgis'],
	verbose: true,
	strict: true
});
