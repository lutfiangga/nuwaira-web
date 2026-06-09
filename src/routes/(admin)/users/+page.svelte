<script lang="ts">
	import { SquarePen, Trash2, Users } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { getCreateUserSchema, getEditUserSchema } from '$lib/app/modules/user/forms/user.form';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import { userDisplayColumns, userExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	const crudState = new CrudState();
	const createUserSchema = $derived(getCreateUserSchema());
	const editUserSchema = $derived(getEditUserSchema());

	let selectedIds = $state<string[]>([]);
	let visibleColumns = $state(getInitialVisibleColumns(userDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `users_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.users, userExportColumns, filename);
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
		selectedIds = checked ? data.users.map((u) => u.id) : [];
	}
</script>

<svelte:head>
	<title>Users | Admin Nuwaira</title>
</svelte:head>

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
		resourceName={crudState.deleteItem.email}
		action="?/delete"
	/>
{/if}

<DataTable
	data={data.users}
	columns={userDisplayColumns}
	total={data.pagination.total}
	page={data.pagination.page}
	pageSize={data.pagination.limit}
	search={data.params.search}
	sortColumn={data.params.sort}
	sortOrder={data.params.order as 'asc' | 'desc'}
	basePath="/users"
	title="Manajemen User"
	subtitle="Akun pengguna Nuwaira"
	icon={Users}
	totalLabel="Total user"
	totalValue={data.pagination.total}
	searchPlaceholder="Cari nama atau email..."
	createLabel="Tambah user"
	onCreate={crudState.openCreate}
	visibleColumns={visibleColumns}
	onToggleColumn={toggleColumn}
	selectedIds={selectedIds}
	onToggleSelect={toggleSelect}
	onSelectAll={handleSelectAll}
	onExport={handleExport}
	bulkDeleteAction="?/bulkDelete"
>
	{#snippet actions(user)}
		<div class="flex gap-2">
			<Button type="button" size="icon" variant="outline" class="rounded-xl" title="Edit user" onclick={() => crudState.openEdit(user)}>
				<SquarePen class="size-4" />
			</Button>
			<Button type="button" size="icon" variant="destructive" class="rounded-xl" title="Hapus user" onclick={() => crudState.openDelete(user)}>
				<Trash2 class="size-4" />
			</Button>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'role'}
			<span class={['inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize', item.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700']}>
				{item.role}
			</span>
		{/if}
	{/snippet}
</DataTable>
