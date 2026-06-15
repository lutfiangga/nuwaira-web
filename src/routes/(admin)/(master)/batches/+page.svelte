<script lang="ts">
	import { SquarePen, Trash2, CalendarDays } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import {
		getCreateBatchFormSchema,
		getEditBatchFormSchema
	} from '$lib/app/modules/program/forms/batch.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { batchDisplayColumns, batchExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createSchema = $derived(getCreateBatchFormSchema(data.offeringOptions));
	const editSchema = $derived(getEditBatchFormSchema(data.offeringOptions));

	let selectedIds = $state<string[]>([]);
	let visibleColumns = $state(getInitialVisibleColumns(batchDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `batches_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.batches, batchExportColumns, filename);
	}

	function toggleColumn(key: string) {
		visibleColumns = { ...visibleColumns, [key]: !visibleColumns[key] };
	}

	function toggleSelect(id: string, checked: boolean) {
		selectedIds = checked ? [...selectedIds, id] : selectedIds.filter((sid) => sid !== id);
	}

	function handleSelectAll(checked: boolean) {
		selectedIds = checked ? data.batches.map((b) => b.id) : [];
	}

	function editBatch(batch: Record<string, any>) {
		const firstSchedule = batch.schedules?.[0];
		crudState.editItem = {
			...batch,
			days: (batch.schedules ?? []).map((schedule: { dayOfWeek: number }) => schedule.dayOfWeek),
			startTime: firstSchedule?.startTime?.slice(0, 5) ?? '',
			endTime: firstSchedule?.endTime?.slice(0, 5) ?? ''
		};
		crudState.showEdit = true;
	}

	function formatDate(d: string | null | undefined) {
		if (!d) return '-';
		try {
			return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return d;
		}
	}
</script>

<svelte:head>
	<title>Batches | Admin Nuwaira</title>
</svelte:head>

<DataTableFormDialog
	bind:open={crudState.showCreate}
	mode="create"
	schema={createSchema}
	action="?/create"
	title="Create Batch"
/>
{#if crudState.showEdit}
	<DataTableFormDialog
		bind:open={crudState.showEdit}
		mode="edit"
		data={crudState.editItem}
		schema={editSchema}
		action="?/update"
		title="Edit Batch"
	/>
{/if}
{#if crudState.showDelete && crudState.deleteItem}
	<DeleteDialog
		bind:open={crudState.showDelete}
		id={crudState.deleteItem.id}
		resourceName={crudState.deleteItem.title}
		action="?/delete"
	/>
{/if}

<DataTable
	data={data.batches}
	columns={batchDisplayColumns}
	total={data.pagination.total}
	page={data.pagination.page}
	pageSize={data.pagination.limit}
	search={data.params.search}
	sortColumn={data.params.sort}
	sortOrder={data.params.order as 'asc' | 'desc'}
	basePath="/batches"
	title="Master Batch"
	subtitle="Tanggal, kapasitas, dan status pendaftaran batch"
	icon={CalendarDays}
	totalLabel="Total batch"
	totalValue={data.pagination.total}
	searchPlaceholder="Cari batch..."
	createLabel="Tambah batch"
	onCreate={crudState.openCreate}
	{visibleColumns}
	onToggleColumn={toggleColumn}
	{selectedIds}
	onToggleSelect={toggleSelect}
	onSelectAll={handleSelectAll}
	onExport={handleExport}
	bulkDeleteAction="?/bulkDelete"
>
	{#snippet actions(batch)}
		<div class="flex gap-2">
			<Button
				type="button"
				size="icon"
				variant="outline"
				class="rounded-xl"
				title="Edit batch"
				onclick={() => editBatch(batch)}
			>
				<SquarePen class="size-4" />
			</Button>
			<Button
				type="button"
				size="icon"
				variant="destructive"
				class="rounded-xl"
				title="Hapus batch"
				onclick={() => crudState.openDelete(batch)}
			>
				<Trash2 class="size-4" />
			</Button>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'isOpen'}
			<span
				class={[
					'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
					item.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
				]}
			>
				{item.isOpen ? 'Open' : 'Closed'}
			</span>
		{:else if key === 'dayText'}
			<span class="text-sm text-slate-600">{item.dayText || '-'}</span>
		{:else if key === 'timeText'}
			<span class="text-sm text-slate-600">{item.timeText || '-'}</span>
		{:else if key === 'startDate'}
			{formatDate(item.startDate)} - {formatDate(item.endDate)}
		{/if}
	{/snippet}
</DataTable>
