<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { newsColumns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2, Eye } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import { getNewsSchema } from '$lib/app/modules/news/forms/news.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';

	let { data } = $props();

	// State management
	const tableState = new TableState(newsColumns);
	// @ts-ignore
	const crudState = new CrudState<any>();

    const newsSchema = getNewsSchema();

</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">News Management</h1>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add News
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={newsSchema}
		action="?/create"
		title="Create News"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={newsSchema}
			action="?/update"
			title="Edit News"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.title}
			title="Delete News"
			description="Are you sure you want to delete this article?"
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter News"
		searchPlaceholder="Search news..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
	/>

	<DataTable
		data={data.news ?? []}
		columns={newsColumns}
		visibleColumns={tableState.visibleColumns}
		searchTerm={tableState.activeSearchTerm}
		bind:sortColumn={tableState.sortColumn}
		bind:sortOrder={tableState.sortOrder}
		bind:selectedRows={tableState.selectedRows}
		bulkDeleteAction="?/bulkDelete"
	>
		{#snippet actions(item)}
			<div class="flex gap-2">
				<Button 
					size="icon" 
					variant="outline" 
					onclick={() => crudState.openSingle(item, `/news/${item.slug}`)} 
					title="View Details"
				>
					<Eye class="w-4 h-4" />
				</Button>
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
