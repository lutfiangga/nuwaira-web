import { DatabaseSeeder } from './DatabaseSeeder';

async function main() {
    try {
        // console.log("Starting database seeding...");
        const result = await DatabaseSeeder.run();
        // console.log("Seeding complete!");
        // console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

main();
