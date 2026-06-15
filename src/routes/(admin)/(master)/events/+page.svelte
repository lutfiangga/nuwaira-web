<script lang="ts">
	import { SquarePen, Trash2, CalendarDays } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { getCreateEventFormSchema, getEditEventFormSchema } from '$lib/app/modules/program/forms/event.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { eventDisplayColumns, eventExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createSchema = $derived(getCreateEventFormSchema());
	const editSchema = $derived(getEditEventFormSchema());

	let selectedIds = $state<string[]>([]);
	let visibleColumns = $state(getInitialVisibleColumns(eventDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `events_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.events, eventExportColumns, filename);
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
		selectedIds = checked ? data.events.map((e) => e.id) : [];
	}
</script>

<svelte:head>
	<title>Events | Admin Nuwaira</title>
</svelte:head>

<DataTableFormDialog
	bind:open={crudState.showCreate}
	mode="create"
	schema={createSchema}
	action="?/create"
	title="Create Event"
/>
{#if crudState.showEdit}
	<DataTableFormDialog
		bind:open={crudState.showEdit}
		mode="edit"
		data={crudState.editItem}
		schema={editSchema}
		action="?/update"
		title="Edit Event"
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
	data={data.events}
	columns={eventDisplayColumns}
	total={data.pagination.total}
	page={data.pagination.page}
	pageSize={data.pagination.limit}
	search={data.params.search}
	sortColumn={data.params.sort}
	sortOrder={data.params.order as 'asc' | 'desc'}
	basePath="/events"
	title="Master Acara"
	subtitle="Atur acara dan kegiatan Nuwaira"
	icon={CalendarDays}
	totalLabel="Total acara"
	totalValue={data.pagination.total}
	searchPlaceholder="Cari acara..."
	createLabel="Tambah acara"
	onCreate={crudState.openCreate}
	visibleColumns={visibleColumns}
	onToggleColumn={toggleColumn}
	selectedIds={selectedIds}
	onToggleSelect={toggleSelect}
	onSelectAll={handleSelectAll}
	onExport={handleExport}
	bulkDeleteAction="?/bulkDelete"
>
	{#snippet actions(event)}
		<div class="flex gap-2">
			<Button type="button" size="icon" variant="outline" class="rounded-xl" title="Edit event" onclick={() => crudState.openEdit(event)}>
				<SquarePen class="size-4" />
			</Button>
			<Button type="button" size="icon" variant="destructive" class="rounded-xl" title="Hapus event" onclick={() => crudState.openDelete(event)}>
				<Trash2 class="size-4" />
			</Button>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'isActive'}
			<span class={['inline-flex rounded-full px-3 py-1 text-xs font-semibold', item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']}>
				{item.isActive ? 'Active' : 'Inactive'}
			</span>
		{:else if key === 'summary'}
			<span class="line-clamp-2 max-w-xs text-xs text-slate-500">{item.summary}</span>
		{:else if key === 'startAt' || key === 'endAt'}
			{item[key] ? new Date(item[key]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
		{/if}
	{/snippet}
</DataTable>
