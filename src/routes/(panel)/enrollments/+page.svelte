<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { enrollmentColumns, type EnrollmentRow } from './columns';
	import { getEnrollmentSchema } from '$lib/app/modules/enrollment/forms/enrollment.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	const tableState = new TableState(enrollmentColumns);
	const crudState = new CrudState<EnrollmentRow>();

	const enrollmentSchema = $derived(
		getEnrollmentSchema(
			(data.students ?? []).map((item) => ({
				value: item.id,
				label: `${item.studentCode} - ${item.fullName}`
			})),
			(data.classes ?? []).map((item) => ({
				value: item.id,
				label: `${item.code} - ${item.title}`
			}))
		)
	);

	function handleExport(format: ExportFormat) {
		const filename = `enrollments_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.enrollments ?? [], enrollmentColumns, filename);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-end items-center">
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Enrollment
		</Button>
	</div>

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={enrollmentSchema}
		action="?/create"
		title="Create Enrollment"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={enrollmentSchema}
			action="?/update"
			title="Edit Enrollment"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={`${crudState.deleteItem.studentName ?? '-'} - ${crudState.deleteItem.classTitle ?? '-'}`}
			title="Delete Enrollment"
			description="Yakin ingin menghapus enrollment ini?"
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Enrollments"
		searchPlaceholder="Cari siswa atau kelas..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
	/>

	<DataTable
		data={data.enrollments ?? []}
		columns={enrollmentColumns}
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
