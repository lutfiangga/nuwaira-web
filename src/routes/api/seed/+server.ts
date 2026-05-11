import { json } from '@sveltejs/kit';
import { DatabaseSeeder } from '$lib/app/database/seeders/DatabaseSeeder';

export const GET = async () => {
    try {
        const result = await DatabaseSeeder.run();
        return json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Seeding error:', error);
        return json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
};
