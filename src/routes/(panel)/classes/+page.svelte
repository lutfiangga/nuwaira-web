<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { classColumns, type ClassRow } from './columns';
	import { bootcampClassSchema } from '$lib/app/modules/bootcamp-class/forms/bootcamp-class.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	const tableState = new TableState(classColumns);
	const crudState = new CrudState<ClassRow>();

	function handleExport(format: ExportFormat) {
		const filename = `bootcamp_classes_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.classes ?? [], classColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-end items-center">
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Class
		</Button>
	</div>

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={bootcampClassSchema}
		action="?/create"
		title="Create Class"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={bootcampClassSchema}
			action="?/update"
			title="Edit Class"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.title}
			title="Delete Class"
			description="Materi dan enrollment yang terhubung ke kelas ini ikut terhapus."
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Classes"
		searchPlaceholder="Cari kelas, mentor, level..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
	/>

	<DataTable
		data={data.classes ?? []}
		columns={classColumns}
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
