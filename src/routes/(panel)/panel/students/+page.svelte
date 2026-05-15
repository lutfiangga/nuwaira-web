<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { studentColumns, type StudentRow } from './columns';
	import { studentSchema } from '$lib/app/modules/student/forms/student.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	const tableState = new TableState(studentColumns);
	const crudState = new CrudState<StudentRow>();

	function handleExport(format: ExportFormat) {
		const filename = `students_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.students ?? [], studentColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold">Students</h1>
			<p class="text-muted-foreground">Kelola data siswa personal dan business</p>
		</div>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Student
		</Button>
	</div>

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={studentSchema}
		action="?/create"
		title="Create Student"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={studentSchema}
			action="?/update"
			title="Edit Student"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.fullName}
			title="Delete Student"
			description="Data enrollment siswa ini juga akan terhapus."
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Students"
		searchPlaceholder="Cari nama, email, company..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
	/>

	<DataTable
		data={data.students ?? []}
		columns={studentColumns}
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
