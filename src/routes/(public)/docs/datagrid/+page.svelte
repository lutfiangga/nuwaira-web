<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Grid3x3, Code2, Search, Infinity, Component } from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">DataGrid Component</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Reusable card-based grid component with infinite scroll and search filtering.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"
			>
				<Grid3x3 class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Features</h2>
				<p class="text-muted-foreground">What makes DataGrid powerful</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Component class="h-5 w-5" />
						Fully Reusable
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Generic component that works with any data type:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Type-safe with TypeScript generics</li>
						<li>Custom card rendering via snippets</li>
						<li>Column-based configuration</li>
						<li>Works with any data structure</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Infinity class="h-5 w-5" />
						Infinite Scroll
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Client-side infinite scrolling for performance:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Uses IntersectionObserver API</li>
						<li>Loads 12 items initially, +12 on scroll</li>
						<li>Shows loading indicator</li>
						<li>"No more items" message at end</li>
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
					<p class="text-sm text-muted-foreground mb-4">
						Configurable search across multiple fields:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Derives searchable fields from columns</li>
						<li>Case-insensitive filtering</li>
						<li>Real-time results</li>
						<li>Clear button to reset</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Grid3x3 class="h-5 w-5" />
						Responsive Grid
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Automatically adjusts columns based on screen size: 1 column on mobile, up to 4 on
						extra-large screens.
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
				<h2 class="text-3xl font-bold tracking-tight">Usage Example</h2>
				<p class="text-muted-foreground">How to use DataGrid in your routes</p>
			</div>
		</div>

		<Card.Card class="bg-slate-950 text-slate-50">
			<Card.CardHeader>
				<Card.CardTitle class="text-slate-50">Basic Implementation</Card.CardTitle>
			</Card.CardHeader>
			<Card.CardContent>
				<pre class="overflow-x-auto text-xs font-mono"><code
						>{`<script lang="ts">
  import DataGrid from '$lib/components/custom-list/data-grid.svelte';
  import { myColumns } from './columns';
  
  let { data } = $props();
</script>

<DataGrid data={data.items} columns={myColumns}>
  {#snippet renderCard(item)}
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>{item.name}</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent>
        <p>{item.description}</p>
      </Card.CardContent>
    </Card.Card>
  {/snippet}
</DataGrid>`}</code
					></pre>
			</Card.CardContent>
		</Card.Card>

		<Card.Card class="bg-slate-950 text-slate-50">
			<Card.CardHeader>
				<Card.CardTitle class="text-slate-50">Column Definition</Card.CardTitle>
			</Card.CardHeader>
			<Card.CardContent>
				<pre class="overflow-x-auto text-xs font-mono"><code
						>{`// columns.ts
import type { DataTableColumn } from '$lib/types/data-table';

export const myColumns: DataTableColumn<MyType>[] = [
  {
    accessorKey: 'name',
    label: 'Name',
    sortable: true,
    searchable: true  // This field will be searchable
  },
  {
    accessorKey: 'description',
    label: 'Description',
    searchable: true  // This too
  },
  {
    accessorKey: 'price',
    label: 'Price',
    sortable: true,
    type: 'number'
  }
];`}</code
					></pre>
			</Card.CardContent>
		</Card.Card>
	</section>

	<Separator />

	<!-- Props -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">Component Props</h2>

		<div class="border rounded-lg overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-muted">
					<tr>
						<th class="text-left p-3 font-semibold">Prop</th>
						<th class="text-left p-3 font-semibold">Type</th>
						<th class="text-left p-3 font-semibold">Required</th>
						<th class="text-left p-3 font-semibold">Description</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					<tr>
						<td class="p-3 font-mono text-xs">data</td>
						<td class="p-3 font-mono text-xs">T[]</td>
						<td class="p-3">Yes</td>
						<td class="p-3">Array of items to display</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">columns</td>
						<td class="p-3 font-mono text-xs">DataTableColumn&lt;T&gt;[]</td>
						<td class="p-3">No</td>
						<td class="p-3">Column definitions (for search config)</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">renderCard</td>
						<td class="p-3 font-mono text-xs">Snippet&lt;[T]&gt;</td>
						<td class="p-3">Yes</td>
						<td class="p-3">Snippet to render each card</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<Separator />

	<!-- Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">Real-World Examples</h2>

		<div class="grid gap-4">
			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2">Menu Module</h3>
				<p class="text-sm text-muted-foreground mb-2">
					Uses DataGrid to display menu items with multiple images, category badges, and price
					formatting.
				</p>
				<code class="text-xs">src/routes/panel/menu/+page.svelte</code>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2">Moments Module</h3>
				<p class="text-sm text-muted-foreground mb-2">
					Uses DataGrid to create a photo gallery with large image cards and hover zoom effects.
				</p>
				<code class="text-xs">src/routes/panel/moments/+page.svelte</code>
			</div>
		</div>
	</section>
</div>
