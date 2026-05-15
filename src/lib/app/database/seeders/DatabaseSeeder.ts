import { db } from '$lib/app/database';
import { user, product, news, category, outlet, menu, moments } from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';

export class DatabaseSeeder {

    static async seedUsers() {
        const existingUsers = await db.select().from(user).limit(1);

        if (existingUsers.length === 0) {
            const passwordHash = await hashPassword('password123');
            const users: typeof user.$inferInsert[] = [
                { id: crypto.randomUUID(), username: 'admin', email: 'admin@example.com', roleId: 'superadmin', name: 'Admin User', age: 30, passwordHash },
                { id: crypto.randomUUID(), username: 'user1', email: 'user1@example.com', roleId: 'instructor', name: 'User One', age: 25, passwordHash },
                { id: crypto.randomUUID(), username: 'user2', email: 'user2@example.com', roleId: 'learner', name: 'User Two', age: 28, passwordHash },
            ];
            await db.insert(user).values(users);
            return `Seeded ${users.length} users.`;
        }

        return "Users already seeded.";
    }

    static async seedCategories() {
        const existingCategories = await db.select().from(category).limit(1);

        if (existingCategories.length === 0) {
            const categories: typeof category.$inferInsert[] = [
                { id: 'cat_electronics', name: 'Electronics', description: 'Gadgets and electronic devices' },
                { id: 'cat_furniture', name: 'Furniture', description: 'Home and office furniture' },
                { id: 'cat_appliances', name: 'Appliances', description: 'Home appliances' },
                { id: 'cat_apparel', name: 'Apparel', description: 'Clothing and accessories' },
                { id: 'cat_stationery', name: 'Stationery', description: 'Office supplies' },
            ];
            await db.insert(category).values(categories);
            return `Seeded ${categories.length} categories.`;
        }
        return "Categories already seeded.";
    }

    static async seedProducts() {
        const existingProducts = await db.select().from(product).limit(1);

        if (existingProducts.length === 0) {
            // Need categories first
            const products: typeof product.$inferInsert[] = [
                { id: crypto.randomUUID(), name: 'Laptop Pro', categoryId: 'cat_electronics', price: 1200, stock: 50 },
                { id: crypto.randomUUID(), name: 'Smartphone X', categoryId: 'cat_electronics', price: 800, stock: 120 },
                { id: crypto.randomUUID(), name: 'Desk Chair', categoryId: 'cat_furniture', price: 150, stock: 20 },
                { id: crypto.randomUUID(), name: 'Coffee Maker', categoryId: 'cat_appliances', price: 80, stock: 45 },
                { id: crypto.randomUUID(), name: 'Running Shoes', categoryId: 'cat_apparel', price: 100, stock: 200 },
                { id: crypto.randomUUID(), name: 'Wireless Headphones', categoryId: 'cat_electronics', price: 200, stock: 85 },
                { id: crypto.randomUUID(), name: 'Notebook', categoryId: 'cat_stationery', price: 5, stock: 500 },
            ];
            await db.insert(product).values(products);
            return `Seeded ${products.length} products.`;
        }

        return "Products already seeded.";
    }
    
    static async seedOutlets() {
        const existingOutlets = await db.select().from(outlet).limit(1);

        if (existingOutlets.length === 0) {
            const outlets: typeof outlet.$inferInsert[] = [
                { id: crypto.randomUUID(), name: 'Main Branch', address: '123 Main St, Jakarta', city: 'Jakarta', province: 'DKI Jakarta', district: 'Central Jakarta', latitude: -6.175110, longitude: 106.865036 },
                { id: crypto.randomUUID(), name: 'Bandung Outlet', address: '456 Dago St, Bandung', city: 'Bandung', province: 'West Java', district: 'Coblong', latitude: -6.917464, longitude: 107.619125 },
                { id: crypto.randomUUID(), name: 'Surabaya Center', address: '789 Tunjungan St, Surabaya', city: 'Surabaya', province: 'East Java', district: 'Tegalsari', latitude: -7.257472, longitude: 112.752088 },
            ];
            await db.insert(outlet).values(outlets);
            return `Seeded ${outlets.length} outlets.`;
        }
        return "Outlets already seeded.";
    }

    static async seedNews() {
        const existingNews = await db.select().from(news).limit(1);

        if (existingNews.length === 0) {
            const newsData: typeof news.$inferInsert[] = [
                { 
                    id: crypto.randomUUID(), 
                    title: 'Welcome to the New Platform', 
                    slug: 'welcome-to-the-new-platform',
                    content: '<h1>Welcome!</h1><p>We are excited to announce our new platform. It features a robust news management system.</p>',
                    thumbnail: null,
                },
                { 
                    id: crypto.randomUUID(), 
                    title: 'Feature Update: Rich Text Editor', 
                    slug: 'feature-update-rich-text-editor',
                    content: '<h1>Rich Text Editing</h1><p>You can now edit news with full formatting options using Quill.js.</p><ul><li>Bold, Italic</li><li>Lists</li><li>Images</li></ul>',
                    thumbnail: null,
                },
                { 
                    id: crypto.randomUUID(), 
                    title: 'Maintenance Schedule', 
                    slug: 'maintenance-schedule',
                    content: '<p>Scheduled maintenance will occur this weekend to improve database performance.</p>',
                    thumbnail: null,
                },
            ];
            await db.insert(news).values(newsData);
            return `Seeded ${newsData.length} news articles.`;
        }

        return "News already seeded.";
    }

    static async seedMenus() {
        const existingMenus = await db.select().from(menu).limit(1);

        if (existingMenus.length === 0) {
            const menus: typeof menu.$inferInsert[] = Array.from({ length: 20 }, (_, i) => ({
                id: crypto.randomUUID(),
                name: `Menu Item ${i + 1}`,
                category: i % 2 === 0 ? 'Food' : 'Beverage',
                price: (i + 1) * 15000,
                description: `Delicious ${i % 2 === 0 ? 'food' : 'drink'} item number ${i + 1}`,
                images: [
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60'
                ]
            }));
            await db.insert(menu).values(menus);
            return `Seeded ${menus.length} menu items.`;
        }
        return "Menus already seeded.";
    }

    static async seedMoments() {
        const existingMoments = await db.select().from(moments).limit(1);

        if (existingMoments.length === 0) {
            const momentsData: typeof moments.$inferInsert[] = Array.from({ length: 20 }, (_, i) => ({
                id: crypto.randomUUID(),
                title: `Special Moment ${i + 1}`,
                description: `A wonderful memory from day ${i + 1}`,
                date: new Date(Date.now() - i * 86400000),
                image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&auto=format&fit=crop&q=60`
            }));
            await db.insert(moments).values(momentsData);
            return `Seeded ${momentsData.length} moments.`;
        }
        return "Moments already seeded.";
    }

    static async run() {
        const userMsg = await this.seedUsers();
        const catMsg = await this.seedCategories();
        // Products depend on Categories, so run sequentially
        const prodMsg = await this.seedProducts();
        const outletMsg = await this.seedOutlets();
        const newsMsg = await this.seedNews();
        const menuMsg = await this.seedMenus();
        const momentsMsg = await this.seedMoments();

        return {
            message: "Seeding complete",
            users: userMsg,
            categories: catMsg,
            products: prodMsg,
            outlets: outletMsg,
            news: newsMsg,
            menus: menuMsg,
            moments: momentsMsg
        };
    }
}
