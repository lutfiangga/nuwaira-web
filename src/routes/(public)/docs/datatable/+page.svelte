<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Table, Code2, Search, FileDown, CheckSquare, Component, Columns } from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">DataTable Component</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Powerful table component with sorting, filtering, bulk operations, and export capabilities.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400"
			>
				<Table class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Features</h2>
				<p class="text-muted-foreground">What makes DataTable powerful</p>
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
						<li>Column-based configuration</li>
						<li>Custom action snippets</li>
						<li>Works with any data structure</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Search class="h-5 w-5" />
						Search & Sort
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Advanced filtering and sorting:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Real-time search across searchable columns</li>
						<li>Click column headers to sort</li>
						<li>Ascending/descending toggle</li>
						<li>Case-insensitive filtering</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<CheckSquare class="h-5 w-5" />
						Bulk Operations
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Select and act on multiple rows:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Select all or individual rows</li>
						<li>Bulk delete action</li>
						<li>Selection count display</li>
						<li>Clear selection button</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Columns class="h-5 w-5" />
						Column Control
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Toggle column visibility via DataTableToolbar. Hide/show columns dynamically without losing data.
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
						Export table data in CSV, Excel (XLSX), or PDF formats via the toolbar. Respects current filters and column visibility.
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
				<p class="text-muted-foreground">How to use DataTable in your routes</p>
			</div>
		</div>

		<Card.Card class="bg-slate-950 text-slate-50">
			<Card.CardHeader>
				<Card.CardTitle class="text-slate-50">Basic Implementation</Card.CardTitle>
			</Card.CardHeader>
			<Card.CardContent>
				<pre class="overflow-x-auto text-xs font-mono"><code
						>{`<script lang="ts">
  import DataTable from '$lib/components/custom-table/data-table.svelte';
  import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
  import { myColumns } from './columns';
  import { TableState } from '$lib/app/helpers/table.state.svelte';
  
  let { data } = $props();
  const tableState = new TableState(myColumns);
</script>

<DataTableToolbar
  title="Filter Items"
  searchPlaceholder="Search..."
  bind:searchValue={tableState.searchValue}
  onSearch={tableState.applySearch}
  onClear={tableState.clearSearch}
  bind:columns={tableState.visibleColumns}
  onToggleColumn={tableState.toggleColumn}
/>

<DataTable
  data={data.items}
  columns={myColumns}
  visibleColumns={tableState.visibleColumns}
  searchTerm={tableState.activeSearchTerm}
  bind:sortColumn={tableState.sortColumn}
  bind:sortOrder={tableState.sortOrder}
  bind:selectedRows={tableState.selectedRows}
  bulkDeleteAction="?/bulkDelete"
>
  {#snippet actions(item)}
    <Button onclick={() => edit(item)}>Edit</Button>
    <Button onclick={() => remove(item)}>Delete</Button>
  {/snippet}
</DataTable>`}</code
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
						<td class="p-3">Yes</td>
						<td class="p-3">Column definitions</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">visibleColumns</td>
						<td class="p-3 font-mono text-xs">Record&lt;string, boolean&gt;</td>
						<td class="p-3">No</td>
						<td class="p-3">Column visibility state</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">searchTerm</td>
						<td class="p-3 font-mono text-xs">string</td>
						<td class="p-3">No</td>
						<td class="p-3">Active search filter</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">sortColumn</td>
						<td class="p-3 font-mono text-xs">string</td>
						<td class="p-3">No</td>
						<td class="p-3">Column to sort by (bindable)</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">sortOrder</td>
						<td class="p-3 font-mono text-xs">'asc' | 'desc'</td>
						<td class="p-3">No</td>
						<td class="p-3">Sort direction (bindable)</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">selectedRows</td>
						<td class="p-3 font-mono text-xs">Set&lt;string&gt;</td>
						<td class="p-3">No</td>
						<td class="p-3">Selected row IDs (bindable)</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">bulkDeleteAction</td>
						<td class="p-3 font-mono text-xs">string</td>
						<td class="p-3">No</td>
						<td class="p-3">Form action for bulk delete</td>
					</tr>
					<tr>
						<td class="p-3 font-mono text-xs">actions</td>
						<td class="p-3 font-mono text-xs">Snippet&lt;[T]&gt;</td>
						<td class="p-3">No</td>
						<td class="p-3">Custom action buttons snippet</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<Separator />

	<!-- State Management -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">TableState Helper</h2>

		<Card.Card>
			<Card.CardHeader>
				<Card.CardTitle>Simplified State Management</Card.CardTitle>
			</Card.CardHeader>
			<Card.CardContent>
				<p class="text-sm text-muted-foreground mb-4">
					The <code>TableState</code> class manages all table state (search, sort, selection, column visibility) in one place:
				</p>
				<pre class="overflow-x-auto text-xs font-mono bg-muted p-3 rounded"><code
						>{`const tableState = new TableState(columns);

// Properties:
tableState.searchValue        // Current search input
tableState.activeSearchTerm   // Applied search term
tableState.sortColumn         // Current sort column
tableState.sortOrder          // 'asc' or 'desc'
tableState.selectedRows       // Set of selected IDs
tableState.visibleColumns     // Column visibility map

// Methods:
tableState.applySearch()      // Apply current search
tableState.clearSearch()      // Clear search
tableState.toggleColumn(key)  // Toggle column visibility`}</code
					></pre>
			</Card.CardContent>
		</Card.Card>
	</section>

	<Separator />

	<!-- Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">Real-World Examples</h2>

		<div class="grid gap-4">
			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2">Products Module</h3>
				<p class="text-sm text-muted-foreground mb-2">
					Full-featured table with image columns, category filtering, and export to CSV/Excel/PDF.
				</p>
				<code class="text-xs">src/routes/panel/products/+page.svelte</code>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2">Users Module</h3>
				<p class="text-sm text-muted-foreground mb-2">
					User management with separate create/edit schemas and secure password handling.
				</p>
				<code class="text-xs">src/routes/panel/users/+page.svelte</code>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2">News Module</h3>
				<p class="text-sm text-muted-foreground mb-2">
					Table with custom "View" action to open articles in new tabs using CrudState.
				</p>
				<code class="text-xs">src/routes/panel/news/+page.svelte</code>
			</div>
		</div>
	</section>
</div>
