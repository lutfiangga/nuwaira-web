<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { userColumns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import { createUserSchema, editUserSchema } from '$lib/app/modules/user/forms/user.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	// State management
	const tableState = new TableState(userColumns);
	const crudState = new CrudState();

	// Export handler with switch case
	function handleExport(format: ExportFormat) {
		const filename = `users_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.users ?? [], userColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">User Management</h1>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Create User
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={createUserSchema}
		action="?/create"
		title="Create User"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={editUserSchema}
			action="?/update"
			title="Edit User"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.username}
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Data"
		searchPlaceholder="Search username or ID..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		onExport={handleExport}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
	/>

	<DataTable
		data={data.users ?? []}
		columns={userColumns}
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
