<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Package,
		Database,
		Code2,
		Search,
		FileDown,
		Trash2,
		Image,
		Folder,
		FolderOpen,
		FileCode
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Products Module</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Complete product management system with inventory tracking and category organization.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"
			>
				<Package class="h-8 w-8" />
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
						<Database class="h-5 w-5" />
						Full CRUD Operations
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Complete product lifecycle management:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Create products with multiple images</li>
						<li>Edit product details and inventory</li>
						<li>Delete single or bulk products</li>
						<li>Category-based organization</li>
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
					<p class="text-sm text-muted-foreground mb-4">
						Advanced search and filtering capabilities:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Search by name, category, or ID</li>
						<li>Column visibility toggle</li>
						<li>Sortable columns</li>
						<li>Real-time filtering</li>
					</ul>
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
						Export product data in multiple formats: CSV, Excel (XLSX), and PDF for reports and
						external use.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Image class="h-5 w-5" />
						Image Management
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Upload multiple product images with preview. Images are stored in <code>uploads/products</code> and automatically cleaned up on deletion.
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
							>const product = pgTable('product', {'{'} 
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull().default(0),
  images: json('images').$type&lt;string[]&gt;(),
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
							<span class="font-semibold">lib/app/modules/product/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">models/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>product.schema.ts</span>
							<span class="text-muted-foreground ml-2"># Database table definition</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">forms/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>product.form.ts</span>
							<span class="text-muted-foreground ml-2"># Form field configuration</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/panel/products/</span>
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
					<Package class="h-4 w-4" />
					Managing Products
				</h3>
				<p class="text-sm text-muted-foreground">
					<strong>Create:</strong> Click "Add Product" and fill in name, category, price, stock, and upload images.<br />
					<strong>Edit:</strong> Click the edit icon in the Actions column to modify product details.<br />
					<strong>Delete:</strong> Use the delete icon for single deletion or select multiple rows for bulk delete.
				</p>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<Trash2 class="h-4 w-4" />
					Bulk Operations
				</h3>
				<p class="text-sm text-muted-foreground">
					Select multiple products using checkboxes and use the bulk delete action to remove them all at once. This is useful for cleaning up old inventory.
				</p>
			</div>
		</div>
	</section>
</div>
