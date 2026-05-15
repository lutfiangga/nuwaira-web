<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Utensils,
		Image,
		Database,
		Code2,
		UploadCloud,
		Grid3x3,
		Search,
		Trash2,
		Folder,
		FolderOpen,
		FileCode
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Menu Module</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Card-based menu management system with multiple image support and infinite scroll.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400"
			>
				<Utensils class="h-8 w-8" />
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
						<Grid3x3 class="h-5 w-5" />
						Card Grid View
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Modern card-based layout with infinite scroll:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Responsive grid (1-4 columns)</li>
						<li>Client-side infinite scroll</li>
						<li>Hover effects with floating action buttons</li>
						<li>Image carousel in detail view</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<UploadCloud class="h-5 w-5" />
						Multiple Images
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Upload and manage multiple images per menu item:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li><strong>Add:</strong> Upload multiple images at once</li>
						<li><strong>Edit:</strong> Keep existing, add new, or remove images</li>
						<li><strong>Delete:</strong> Auto-cleanup removes all images from disk</li>
						<li><strong>Preview:</strong> Slide through images in detail dialog</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Search class="h-5 w-5" />
						Smart Search
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Search across name, category, and description fields. Searchable fields are defined
						in <code>columns.ts</code> for type safety.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Trash2 class="h-5 w-5" />
						File Management
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						All images are stored in <code>uploads/menus</code>. When deleting or updating items,
						unused images are automatically removed from the server.
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
							>const menu = pgTable('menu', {'{'} 
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  images: json('images').$type&lt;string[]&gt;(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
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
							<span class="font-semibold">lib/app/modules/menu/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">models/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>menu.schema.ts</span>
							<span class="text-muted-foreground ml-2"># Database table definition</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">forms/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>menu.form.ts</span>
							<span class="text-muted-foreground ml-2"># Form field configuration</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/panel/menu/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>columns.ts</span>
							<span class="text-muted-foreground ml-2"># DataGrid column definitions</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-purple-500" />
							<span>+page.svelte</span>
							<span class="text-muted-foreground ml-2"># UI component</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>+page.server.ts</span>
							<span class="text-muted-foreground ml-2"># Server actions (CRUD)</span>
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
					<Image class="h-4 w-4" />
					Managing Images
				</h3>
				<p class="text-sm text-muted-foreground">
					<strong>Create:</strong> Upload multiple images via the file input.<br />
					<strong>Edit:</strong> Existing images are shown with an "existing" badge. Click the X to remove
					them. Upload new images to add more.<br />
					<strong>View:</strong> Click any card to open the detail dialog and slide through images with
					Previous/Next buttons.
				</p>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<Utensils class="h-4 w-4" />
					Categories
				</h3>
				<p class="text-sm text-muted-foreground">
					Menu items are categorized as <strong>Food</strong> or <strong>Beverage</strong>. This is
					defined in the form schema and can be extended by modifying
					<code>menu.form.ts</code>.
				</p>
			</div>
		</div>
	</section>
</div>
