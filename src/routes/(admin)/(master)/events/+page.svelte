<script lang="ts">
	import { enhance } from '$app/forms';
	import { SquarePen, Trash2, CalendarDays } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import {
		EVENT_TYPE_OPTIONS,
		OTHER_EVENT_TYPE_VALUE,
		getCreateEventFormSchema,
		getEditEventFormSchema
	} from '$lib/app/modules/program/forms/event.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { eventDisplayColumns, eventExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createSchema = $derived(getCreateEventFormSchema());
	const editSchema = $derived(getEditEventFormSchema());
	const eventTypeValues = EVENT_TYPE_OPTIONS.map((option) => option.value);
	const editEventData = $derived(getEventFormData(crudState.editItem));

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

	function submitStatusForm(formId: string) {
		(document.getElementById(formId) as HTMLFormElement | null)?.requestSubmit();
	}

	function handleSelectAll(checked: boolean) {
		selectedIds = checked ? data.events.map((e) => e.id) : [];
	}

	function padDatePart(value: number) {
		return String(value).padStart(2, '0');
	}

	function toDateInput(value: Date | string | null | undefined) {
		const date = value ? new Date(value) : null;
		const validDate = date && !Number.isNaN(date.getTime());
		return validDate
			? `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
			: '';
	}

	function toTimeInput(value: Date | string | null | undefined) {
		const date = value ? new Date(value) : null;
		const validDate = date && !Number.isNaN(date.getTime());
		return validDate ? `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}` : '';
	}

	function formatDateTime(value: Date | string | null | undefined) {
		const date = value ? new Date(value) : null;
		const validDate = date && !Number.isNaN(date.getTime());
		return validDate
			? date.toLocaleString('id-ID', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: '-';
	}

	function getEventTypeFields(event: Record<string, any>) {
		const customType = Boolean(event.eventType && !eventTypeValues.includes(event.eventType));
		return {
			eventType: customType ? OTHER_EVENT_TYPE_VALUE : event.eventType,
			eventTypeOther: customType ? event.eventType : ''
		};
	}

	function getEventFormData(event: Record<string, any> | null) {
		return event
			? {
					...event,
					...getEventTypeFields(event),
					startAt: toDateInput(event.startAt),
					startTime: toTimeInput(event.startAt),
					endAt: toDateInput(event.endAt),
					endTime: toTimeInput(event.endAt)
				}
			: null;
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
		data={editEventData}
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
			{@const statusFormId = `event-status-${item.id}`}
			<form
				id={statusFormId}
				method="POST"
				action="?/toggleStatus"
				use:enhance
				class="flex items-center gap-2"
			>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="isActive" value={item.isActive ? 'false' : 'true'} />
				<Switch
					type="button"
					checked={item.isActive}
					aria-label={`Ubah status ${item.title}`}
					onCheckedChange={() => submitStatusForm(statusFormId)}
				/>
				<span class={['text-xs font-semibold', item.isActive ? 'text-emerald-700' : 'text-slate-500']}>
					{item.isActive ? 'Active' : 'Inactive'}
				</span>
			</form>
		{:else if key === 'eventType'}
			{#if item.eventType}
				<span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
					{item.eventType}
				</span>
			{:else}
				<span class="text-xs text-slate-400">-</span>
			{/if}
		{:else if key === 'location'}
			<span class="line-clamp-1 max-w-xs text-xs text-slate-600">{item.location ?? '-'}</span>
		{:else if key === 'priceAmount'}
			{#if item.priceAmount === null || item.priceAmount === 0}
				<span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Full Beasiswa</span>
			{:else}
				<span class="text-xs font-medium text-slate-700">Rp {new Intl.NumberFormat('id-ID').format(item.priceAmount)}</span>
			{/if}
		{:else if key === 'startAt' || key === 'endAt'}
			<span class="text-xs font-medium text-slate-700">{formatDateTime(item[key])}</span>
		{/if}
	{/snippet}
</DataTable>
