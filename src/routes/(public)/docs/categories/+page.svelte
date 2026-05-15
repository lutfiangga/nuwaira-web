<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		FolderTree,
		Database,
		Code2,
		Search,
		FileDown,
		Tag,
		Folder,
		FolderOpen,
		FileCode
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Categories Module</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Product categorization system for organizing inventory and improving navigation.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400"
			>
				<FolderTree class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Features</h2>
				<p class="text-muted-foreground">What's included in the module</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Tag class="h-5 w-5" />
						Category Management
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Simple and effective category organization:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Create categories with name and description</li>
						<li>Edit category details</li>
						<li>Delete unused categories</li>
						<li>Used by Products module for organization</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Search class="h-5 w-5" />
						Search & Filter
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Search categories by name or description. Sort and filter to quickly find specific categories.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<FileDown class="h-5 w-5" />
						Export Data
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Export category data in CSV, Excel, or PDF formats for documentation and reporting.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Database class="h-5 w-5" />
						Product Integration
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Categories are referenced by products via <code>categoryId</code>. When creating products, you select from available categories.
					</p>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- Technical Details -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
				<Code2 class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Technical Implementation</h2>
				<p class="text-muted-foreground">Schema and Services</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card class="bg-slate-950 text-slate-50">
				<Card.CardHeader>
					<Card.CardTitle class="text-slate-50 flex items-center gap-2">
						<Database class="h-5 w-5" />
						Database Schema
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono"><code
							>const category = pgTable('category', {'{'} 
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description')
{'}'});</code
						></pre>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>File Structure</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<div class="space-y-1 text-xs">
						<div class="flex items-center gap-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">lib/app/modules/category/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">models/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>category.schema.ts</span>
							<span class="text-muted-foreground ml-2"># Database table definition</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">forms/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>category.form.ts</span>
							<span class="text-muted-foreground ml-2"># Form field configuration</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/panel/categories/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>columns.ts</span>
							<span class="text-muted-foreground ml-2"># DataTable column definitions</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-purple-500" />
							<span>+page.svelte</span>
							<span class="text-muted-foreground ml-2"># UI component with CRUD</span>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- How to Use -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">Usage Guide</h2>

		<div class="grid gap-4">
			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<Tag class="h-4 w-4" />
					Creating Categories
				</h3>
				<p class="text-sm text-muted-foreground">
					Click "Add Category" and provide a name and optional description. Categories should be broad enough to group multiple products but specific enough to be meaningful.
				</p>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<FolderTree class="h-4 w-4" />
					Best Practices
				</h3>
				<p class="text-sm text-muted-foreground">
					<strong>Examples:</strong> Electronics, Furniture, Appliances, Apparel, Stationery.<br />
					<strong>Tip:</strong> Create categories before adding products to ensure proper organization from the start.
				</p>
			</div>
		</div>
	</section>
</div>
