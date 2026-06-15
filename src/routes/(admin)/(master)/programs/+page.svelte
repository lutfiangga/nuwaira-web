<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, SquarePen, Trash2, GraduationCap } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { getCreateProgramFormSchema, getEditProgramFormSchema } from '$lib/app/modules/program/forms/program.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { programDisplayColumns, programExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createSchema = $derived(getCreateProgramFormSchema());
	const editSchema = $derived(getEditProgramFormSchema());

	let selectedIds = $state<string[]>([]);
	let visibleColumns = $state(getInitialVisibleColumns(programDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `programs_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.programs, programExportColumns, filename);
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
		selectedIds = checked ? data.programs.map((p) => p.id) : [];
	}
</script>

<svelte:head>
	<title>Programs | Admin Nuwaira</title>
</svelte:head>

<DataTableFormDialog
	bind:open={crudState.showCreate}
	mode="create"
	schema={createSchema}
	action="?/create"
	title="Create Program"
/>
{#if crudState.showEdit}
	<DataTableFormDialog
		bind:open={crudState.showEdit}
		mode="edit"
		data={crudState.editItem}
		schema={editSchema}
		action="?/update"
		title="Edit Program"
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
	data={data.programs}
	columns={programDisplayColumns}
	total={data.pagination.total}
	page={data.pagination.page}
	pageSize={data.pagination.limit}
	search={data.params.search}
	sortColumn={data.params.sort}
	sortOrder={data.params.order as 'asc' | 'desc'}
	basePath="/programs"
	title="Master Program"
	subtitle="Program dan milestone yang tersedia di sistem"
	icon={GraduationCap}
	totalLabel="Total program"
	totalValue={data.pagination.total}
	searchPlaceholder="Cari program..."
	createLabel="Tambah program"
	onCreate={crudState.openCreate}
	visibleColumns={visibleColumns}
	onToggleColumn={toggleColumn}
	selectedIds={selectedIds}
	onToggleSelect={toggleSelect}
	onSelectAll={handleSelectAll}
	onExport={handleExport}
	bulkDeleteAction="?/bulkDelete"
>
	{#snippet actions(program)}
		<div class="flex gap-2">
			<Button href={resolve(`/programs/detail/${program.id}`)} variant="outline" class="rounded-xl">
				Detail <ArrowRight class="size-4" />
			</Button>
			<Button type="button" size="icon" variant="outline" class="rounded-xl" title="Edit program" onclick={() => crudState.openEdit(program)}>
				<SquarePen class="size-4" />
			</Button>
			<Button type="button" size="icon" variant="destructive" class="rounded-xl" title="Hapus program" onclick={() => crudState.openDelete(program)}>
				<Trash2 class="size-4" />
			</Button>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'status'}
			<span class={['inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize', item.status === 'published' ? 'bg-green-100 text-green-700' : item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700']}>
				{item.status}
			</span>
		{/if}
	{/snippet}
</DataTable>
