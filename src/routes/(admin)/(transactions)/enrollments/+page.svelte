<script lang="ts">
	import { SquarePen, Trash2, FileText } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { getCreateEnrollmentFormSchema, getEditEnrollmentFormSchema } from '$lib/app/modules/program/forms/enrollment.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { enrollmentDisplayColumns, enrollmentExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createSchema = $derived(getCreateEnrollmentFormSchema(data.studentOptions, data.offeringOptions, data.batchOptions));
	const editSchema = $derived(getEditEnrollmentFormSchema(data.studentOptions, data.offeringOptions, data.batchOptions));

	let selectedIds = $state<string[]>([]);
	let visibleColumns = $state(getInitialVisibleColumns(enrollmentDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `enrollments_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.enrollments, enrollmentExportColumns, filename);
	}

	function toggleColumn(key: string) {
		visibleColumns = { ...visibleColumns, [key]: !visibleColumns[key] };
	}

	function toggleSelect(id: string, checked: boolean) {
		selectedIds = checked
			? [...selectedIds, id]
			: selectedIds.filter((sid) => sid !== id);
	}

	function handleSelectAll(checked: boolean) {
		selectedIds = checked ? data.enrollments.map((e) => e.id) : [];
	}

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-700',
		accepted: 'bg-green-100 text-green-700',
		rejected: 'bg-red-100 text-red-700',
		cancelled: 'bg-slate-100 text-slate-700',
		completed: 'bg-blue-100 text-blue-700'
	};
</script>

<svelte:head>
	<title>Enrollments | Admin Nuwaira</title>
</svelte:head>

<DataTableFormDialog
	bind:open={crudState.showCreate}
	mode="create"
	schema={createSchema}
	action="?/create"
	title="Create Enrollment"
/>
{#if crudState.showEdit}
	<DataTableFormDialog
		bind:open={crudState.showEdit}
		mode="edit"
		data={crudState.editItem}
		schema={editSchema}
		action="?/update"
		title="Edit Enrollment"
	/>
{/if}
{#if crudState.showDelete && crudState.deleteItem}
	<DeleteDialog
		bind:open={crudState.showDelete}
		id={crudState.deleteItem.id}
		resourceName={`${crudState.deleteItem.studentName}'s enrollment`}
		action="?/delete"
	/>
{/if}

<DataTable
	data={data.enrollments}
	columns={enrollmentDisplayColumns}
	total={data.pagination.total}
	page={data.pagination.page}
	pageSize={data.pagination.limit}
	search={data.params.search}
	sortColumn={data.params.sort}
	sortOrder={data.params.order as 'asc' | 'desc'}
	basePath="/enrollments"
	title="Transaksi Enrollment"
	subtitle="Satu siswa dapat memiliki lebih dari satu pendaftaran program"
	icon={FileText}
	totalLabel="Total enrollment"
	totalValue={data.pagination.total}
	searchPlaceholder="Cari siswa, program, atau batch..."
	createLabel="Tambah enrollment"
	onCreate={crudState.openCreate}
	visibleColumns={visibleColumns}
	onToggleColumn={toggleColumn}
	selectedIds={selectedIds}
	onToggleSelect={toggleSelect}
	onSelectAll={handleSelectAll}
	onExport={handleExport}
	bulkDeleteAction="?/bulkDelete"
>
	{#snippet actions(item)}
		<div class="flex gap-2">
			<Button type="button" size="icon" variant="outline" class="rounded-xl" title="Edit enrollment" onclick={() => crudState.openEdit(item)}>
				<SquarePen class="size-4" />
			</Button>
			<Button type="button" size="icon" variant="destructive" class="rounded-xl" title="Hapus enrollment" onclick={() => crudState.openDelete(item)}>
				<Trash2 class="size-4" />
			</Button>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'student'}
			<div>
				<p class="font-medium">{item.studentName}</p>
				<p class="text-xs text-slate-500">{item.email}</p>
			</div>
		{:else if key === 'batchTitle'}
			{item.batchTitle ?? 'Private'}
		{:else if key === 'status'}
			<span class={['inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize', statusColors[item.status] || 'bg-slate-100 text-slate-700']}>
				{item.status}
			</span>
		{/if}
	{/snippet}
</DataTable>
