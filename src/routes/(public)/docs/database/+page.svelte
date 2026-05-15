<script lang="ts">
	import * as Card from '$lib/components/ui/card';
    import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Database,
		Code2,
		Terminal,
		Table,
        Play,
        Globe
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Database & Seeding</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Using Drizzle ORM and Database Seeders.
		</p>
	</div>

	<!-- Drizzle Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400"
			>
				<Database class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Drizzle ORM</h2>
				<p class="text-muted-foreground">Type-safe SQL for TypeScript</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>Development Commands</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
                    <div class="space-y-4">
                        <div class="bg-muted p-2 rounded-md font-mono text-xs">
                            <span class="text-blue-500">npm</span> run db:push
                        </div>
                        <p class="text-sm text-muted-foreground">
                            Pushes schema changes directly to the database (prototyping).
                        </p>

                        <div class="bg-muted p-2 rounded-md font-mono text-xs">
                            <span class="text-blue-500">npm</span> run db:generate<br/>
                            <span class="text-blue-500">npm</span> run db:migrate
                        </div>
                        <p class="text-sm text-muted-foreground">
                            Generates and runs SQL migrations (production).
                        </p>

                        <div class="bg-muted p-2 rounded-md font-mono text-xs">
                            <span class="text-blue-500">npm</span> run db:studio
                        </div>
                        <p class="text-sm text-muted-foreground">
                            Opens Drizzle Studio visual editor in browser.
                        </p>
                    </div>
				</Card.CardContent>
			</Card.Card>

			<Card.Card class="bg-slate-950 text-slate-50">
				<Card.CardHeader>
					<Card.CardTitle class="text-slate-50">Query Example</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono"><code
							>import {'{'} db {'}'} from '$lib/app/database';
import {'{'} news {'}'} from '$lib/app/database/schema';
import {'{'} desc, eq {'}'} from 'drizzle-orm';

// Select
const articles = await db.select()
    .from(news)
    .orderBy(desc(news.createdAt));

// Insert
await db.insert(news).values({'{'}
    title: 'New Article',
    slug: 'new-article',
    content: '...'
{'}'});</code
						></pre>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

    <!-- Seeding -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
				<Terminal class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Database Seeder</h2>
				<p class="text-muted-foreground">Populate database with dummy data</p>
			</div>
		</div>

        <p class="leading-7">
            The `DatabaseSeeder` class handles populating your database with initial data for development.
        </p>

        <Card.Card>
            <Card.CardHeader>
                <Card.CardTitle>Running the Seeder</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
                 <p class="text-sm text-muted-foreground mb-4">
                    We have provided a convenient API endpoint to seed your database. 
                    Simply visit the URL below in your browser or make a GET request.
                </p>
                
                <div class="flex items-center gap-2 p-3 bg-muted rounded-md mb-4 border">
                    <Globe class="h-4 w-4 text-blue-500" />
                    <code class="text-sm font-mono flex-1">http://localhost:5173/api/seed</code>
                    <Badge variant="outline">GET</Badge>
                </div>

                <div class="bg-muted/50 p-4 rounded-md border">
                    <h4 class="font-semibold mb-2 text-sm flex items-center gap-2">
                        <Terminal class="h-3 w-3" />
                         Response Example
                    </h4>
                    <pre class="bg-background p-2 rounded text-xs font-mono overflow-x-auto text-muted-foreground">
{'{'}
  "success": true,
  "data": {'{'}
    "message": "Seeding complete",
    "users": "Seeded 3 users.",
    "categories": "Seeded 5 categories.",
    "products": "Seeded 7 products.",
    "outlets": "Seeded 3 outlets.",
    "news": "Seeded 3 news articles."
  {'}'}
{'}'}</pre>
                </div>
            </Card.CardContent>
        </Card.Card>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>Included Seeds</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
                        <li class="flex items-center gap-2">
                            <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">seedUsers()</span>
                            Creates admin and standard users
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-mono">seedProducts()</span>
                            Creates dummy products
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-mono">seedNews()</span>
                            Creates news articles with content
                        </li>
                    </ul>
				</Card.CardContent>
			</Card.Card>
            
            <Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>Adding New Seeds</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono bg-muted p-2 rounded"><code
							>// 1. Add method to DatabaseSeeder class
static async seedMyModule() {'{'}
    // logic...
{'}'}

// 2. Add to run() method
static async run() {'{'}
    await this.seedMyModule();
    // ...
{'}'}</code
						></pre>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>
</div>
