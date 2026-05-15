<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { categoryColumns, type Category } from './columns';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { categorySchema } from '$lib/app/modules/category/forms/category.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	// State management
	const tableState = new TableState(categoryColumns);
	const crudState = new CrudState<Category>();

	// Export handlers
	function handleExport(format: ExportFormat) {
		const filename = `categories_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.categories ?? [], categoryColumns, filename);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Categories</h1>
			<p class="text-muted-foreground">Manage product categories</p>
		</div>
		<button
			class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			onclick={crudState.openCreate}
		>
			<Plus class="h-4 w-4" />
			Add Category
		</button>
	</div>

	<DataTableToolbar
		title="Filter Categories"
		searchPlaceholder="Search categories..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
		exportFormats={['csv', 'xlsx', 'pdf']}
	/>

	<DataTable
		data={data.categories}
		columns={categoryColumns}
		visibleColumns={tableState.visibleColumns}
		searchTerm={tableState.activeSearchTerm}
		bind:selectedRows={tableState.selectedRows}
		deleteAction="?/delete"
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

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={categorySchema}
		action="?/create"
		title="Create Category"
	/>

	{#if crudState.showEdit && crudState.editItem}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={categorySchema}
			action="?/update"
			title="Edit Category"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.name}
			title="Delete Category"
			description="Are you sure you want to delete this category?"
			action="?/delete"
		/>
	{/if}
</div>
