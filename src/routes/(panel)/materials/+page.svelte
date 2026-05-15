<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { materialColumns, type MaterialRow } from './columns';
	import { getClassMaterialSchema } from '$lib/app/modules/class-material/forms/class-material.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	const tableState = new TableState(materialColumns);
	const crudState = new CrudState<MaterialRow>();

	const materialSchema = $derived(
		getClassMaterialSchema(
			(data.classes ?? []).map((item) => ({
				value: item.id,
				label: `${item.code} - ${item.title}`
			}))
		)
	);

	function handleExport(format: ExportFormat) {
		const filename = `class_materials_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.materials ?? [], materialColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-end items-center">
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Material
		</Button>
	</div>

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={materialSchema}
		action="?/create"
		title="Create Material"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={materialSchema}
			action="?/update"
			title="Edit Material"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.title}
			title="Delete Material"
			description="Yakin ingin menghapus materi ini?"
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Materials"
		searchPlaceholder="Cari kelas, judul materi..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
	/>

	<DataTable
		data={data.materials ?? []}
		columns={materialColumns}
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
