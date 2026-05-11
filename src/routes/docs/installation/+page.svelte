<script lang="ts">
	import { Code } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<div class="space-y-6">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Installation</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Step-by-step guide to setting up the project locally.
		</p>
	</div>

	<!-- Prerequisites -->
	<Card.Card>
		<Card.CardHeader>
			<Card.CardTitle>Prerequisites</Card.CardTitle>
			<Card.CardDescription
				>Ensure you have the following installed before starting.</Card.CardDescription
			>
		</Card.CardHeader>
		<Card.CardContent>
			<div class="flex gap-2">
				<Badge variant="outline">Node.js 18+</Badge>
				<Badge variant="outline">PostgreSQL 14+</Badge>
				<Badge variant="outline">npm or pnpm</Badge>
			</div>
		</Card.CardContent>
	</Card.Card>

	<div class="prose prose-slate max-w-none dark:prose-invert">
		<h3 class="border-b pb-2">Steps</h3>
	</div>

	<!-- Steps -->
	<div class="space-y-4">
		<div class="grid gap-4">
			<!-- Step 1 -->
			<div class="relative pl-8">
				<div
					class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
				>
					1
				</div>
				<h4 class="font-semibold mb-2 text-lg">Clone the repository</h4>
				<div class="bg-muted rounded-md p-4 overflow-x-auto border">
					<code class="text-sm font-mono">npx degit lutfiangga/zvelkit my-app<br />cd my-app</code>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="relative pl-8">
				<div
					class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
				>
					2
				</div>
				<h4 class="font-semibold mb-2 text-lg">Install dependencies</h4>
				<div class="bg-muted rounded-md p-4 overflow-x-auto border">
					<code class="text-sm font-mono">npm install</code>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="relative pl-8">
				<div
					class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
				>
					3
				</div>
				<h4 class="font-semibold mb-2 text-lg">Configure Environment</h4>
				<p class="text-sm text-muted-foreground mb-2">
					Create a <code>.env</code> file in the root directory.
				</p>
				<div class="bg-muted rounded-md p-4 overflow-x-auto border">
					<code class="text-sm font-mono"
						>DATABASE_URL="postgresql://user:password@localhost:5432/dbname"</code
					>
				</div>
			</div>

			<!-- Step 4 -->
			<div class="relative pl-8">
				<div
					class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
				>
					4
				</div>
				<h4 class="font-semibold mb-2 text-lg">Setup Database</h4>
				<p class="text-sm text-muted-foreground mb-2">
					Run migrations to setup your database schema.
				</p>
				<div class="bg-muted rounded-md p-4 overflow-x-auto border">
					<code class="text-sm font-mono">npx drizzle-kit push</code>
				</div>
			</div>

			<!-- Step 5 -->
			<div class="relative pl-8">
				<div
					class="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
				>
					5
				</div>
				<h4 class="font-semibold mb-2 text-lg">Run Development Server</h4>
				<div class="bg-muted rounded-md p-4 overflow-x-auto border">
					<code class="text-sm font-mono">npm run dev</code>
				</div>
				<p class="text-sm text-muted-foreground mt-2">
					The application should now be running at <a
						href="http://localhost:5173"
						class="text-primary hover:underline">http://localhost:5173</a
					>.
				</p>
			</div>
		</div>
	</div>
</div>
