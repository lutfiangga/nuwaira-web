<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { productColumns, type Product } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import { getProductSchema } from '$lib/app/modules/product/forms/product.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	// State management
	const tableState = new TableState(productColumns);
	const crudState = new CrudState<Product>();

	// Form Schema
	const productSchema = $derived(
		getProductSchema(data.categories.map((cat) => ({ value: cat.id, label: cat.name })))
	);

	// Export handler with switch case
	function handleExport(format: ExportFormat) {
		const filename = `products_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.products ?? [], productColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">Product Management</h1>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Product
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={productSchema}
		action="?/create"
		title="Create Product"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={productSchema}
			action="?/update"
			title="Edit Product"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.name}
			title="Delete Product"
			description="Are you sure you want to delete this product?"
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Products"
		searchPlaceholder="Search products..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
	/>

	<DataTable
		data={data.products ?? []}
		columns={productColumns}
		visibleColumns={tableState.visibleColumns}
		searchTerm={tableState.activeSearchTerm}
		bind:sortColumn={tableState.sortColumn}
		bind:sortOrder={tableState.sortOrder}
		bind:selectedRows={tableState.selectedRows}
		bulkDeleteAction="?/bulkDelete"
	>
		{#snippet actions(item)}
			<div class="flex gap-2">
				<Button size="icon" variant="ghost" onclick={() => crudState.openEdit(item)} title="Edit">
					<SquarePen class="w-4 h-4" />
				</Button>
				<Button
					size="icon"
					variant="destructive"
					onclick={() => crudState.openDelete(item)}
					title="Delete"
				>
					<Trash2 class="w-4 h-4" />
				</Button>
			</div>
		{/snippet}
	</DataTable>
</div>
