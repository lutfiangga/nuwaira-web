import type { RequestHandler } from './$types';
import { DatabaseSeeder } from '$lib/app/database/seeders/DatabaseSeeder';

export const GET: RequestHandler = async () => {
    try {
        const result = await DatabaseSeeder.run();

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Seeding error:", error);
        return new Response(JSON.stringify({ error: "Failed to seed database", details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
