<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Lightbulb, ArrowRight } from '@lucide/svelte';
</script>

<div class="space-y-6">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Create New Module
		</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			A guide to extending the application with new features.
		</p>
	</div>

	<Alert.Root
		variant="default"
		class="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
	>
		<Lightbulb class="h-4 w-4 text-blue-500" />
		<Alert.Title>Pro Tip</Alert.Title>
		<Alert.Description>
			Always follow the established pattern: Schema -> Service -> Routes. This keeps the codebase
			consistent.
		</Alert.Description>
	</Alert.Root>

	<div class="space-y-8 pt-4">
		<!-- Step 1 -->
		<div class="flex gap-4">
			<div class="flex-none">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
				>
					1
				</div>
			</div>
			<div class="space-y-2 flex-1">
				<h3 class="text-xl font-bold">Create Module Directory</h3>
				<p class="text-muted-foreground">
					Create the folder structure in <code>src/lib/app/modules/[name]</code>.
				</p>
				<Card.Card class="bg-muted/50 border-dashed">
					<Card.CardContent class="p-4 font-mono text-sm">
						src/lib/app/modules/<span class="text-green-600 font-bold">new_feature</span>/
						<br />├── models/
						<br />└── services/
					</Card.CardContent>
				</Card.Card>
			</div>
		</div>

		<!-- Step 2 -->
		<div class="flex gap-4">
			<div class="flex-none">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
				>
					2
				</div>
			</div>
			<div class="space-y-2 flex-1">
				<h3 class="text-xl font-bold">Define Schema</h3>
				<p class="text-muted-foreground">
					Create <code>models/[name].schema.ts</code>.
				</p>
				<div class="bg-slate-950 rounded-lg p-4 overflow-x-auto">
					<pre class="text-sm font-mono text-slate-50"><code
							>import {'{'} pgTable, text {'}'} from 'drizzle-orm/pg-core';

export const myTable = pgTable('my_table', {'{'}
    id: text('id').primaryKey(),
    title: text('title').notNull()
{'}'});</code
						></pre>
				</div>
			</div>
		</div>

		<!-- Step 3 -->
		<div class="flex gap-4">
			<div class="flex-none">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground"
				>
					3
				</div>
			</div>
			<div class="space-y-2 flex-1">
				<h3 class="text-xl font-bold">Register Schema (Crucial!)</h3>
				<p class="text-muted-foreground">
					You must export your new schema in the consolidated file.
				</p>
				<Card.Card class="border-destructive/50">
					<Card.CardContent class="p-4">
						<p class="text-sm font-medium mb-2">
							File: <code>src/lib/app/database/schema-drizzle.ts</code>
						</p>
						<div class="bg-muted p-2 rounded text-sm font-mono">
							export * from '../modules/new_feature/models/new_feature.schema';
						</div>
					</Card.CardContent>
				</Card.Card>
			</div>
		</div>

		<!-- Step 4 -->
		<div class="flex gap-4">
			<div class="flex-none">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
				>
					4
				</div>
			</div>
			<div class="space-y-2 flex-1">
				<h3 class="text-xl font-bold">Build the UI</h3>
				<p class="text-muted-foreground">
					Create your routes in <code>src/routes/[name]</code>.
				</p>
				<div class="flex items-center gap-2 text-sm text-green-600 font-medium">
					<ArrowRight class="h-4 w-4" />
					<span>Don't forget to use the DashboardLayout!</span>
				</div>
			</div>
		</div>
	</div>
</div>
