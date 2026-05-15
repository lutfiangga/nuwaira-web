<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { outletColumns, type Outlet } from './columns';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { getOutletSchema } from '$lib/app/modules/outlet/forms/outlet.form';
	import { TableState } from '$lib/app/helpers/table.state.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

	let { data } = $props();

	// State management
	const tableState = new TableState(outletColumns);
	const crudState = new CrudState<Outlet>();

	// Location data for comboboxes
	let provinces: any[] = $state([]);
	let cities: any[] = $state([]);
	let districts: any[] = $state([]);

	// Load provinces on mount
	onMount(async () => {
		try {
			const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
			provinces = await res.json();
		} catch (e) {
			console.error('Failed to load provinces:', e);
		}
	});

	// Handlers for cascading selection
	async function handleProvinceSelect(selectedProvince: string) {
		const prov = provinces.find((p) => p.name === selectedProvince);
		if (prov) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`
				);
				cities = await res.json();
			} catch (e) {
				console.error('Failed to load cities:', e);
			}
		}
	}

	async function handleCitySelect(selectedCity: string) {
		const cty = cities.find((c) => c.name === selectedCity);
		if (cty) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cty.id}.json`
				);
				districts = await res.json();
			} catch (e) {
				console.error('Failed to load districts:', e);
			}
		}
	}

	// Computed options for comboboxes
	const provinceOptions = $derived(provinces.map((p) => ({ value: p.name, label: p.name })));
	const cityOptions = $derived(cities.map((c) => ({ value: c.name, label: c.name })));
	const districtOptions = $derived(districts.map((d) => ({ value: d.name, label: d.name })));

	const outletSchema = $derived(
		getOutletSchema(
			provinceOptions,
			cityOptions,
			districtOptions,
			handleProvinceSelect,
			handleCitySelect
		)
	);

	function handleEdit(item: Outlet) {
		// Convert latitude and longitude to string for the form
		crudState.openEdit({
			...item,
			latitude: item.latitude?.toString() as any,
			longitude: item.longitude?.toString() as any
		});
	}

	// Export handler - outlets only uses CSV and Excel
	function handleExport(format: ExportFormat) {
		const filename = `outlets_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.outlets ?? [], outletColumns, filename);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Outlets</h1>
			<p class="text-muted-foreground">Manage store outlets and locations</p>
		</div>
		<button
			class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			onclick={crudState.openCreate}
		>
			<Plus class="h-4 w-4" />
			Add Outlet
		</button>
	</div>

	<DataTableToolbar
		title="Filter Outlets"
		searchPlaceholder="Search outlets..."
		bind:searchValue={tableState.searchValue}
		onSearch={tableState.applySearch}
		onClear={tableState.clearSearch}
		bind:columns={tableState.visibleColumns}
		onToggleColumn={tableState.toggleColumn}
		onExport={handleExport}
		exportFormats={['csv', 'xlsx']}
	/>

	<DataTable
		data={data.outlets}
		columns={outletColumns}
		visibleColumns={tableState.visibleColumns}
		searchTerm={tableState.activeSearchTerm}
		bind:selectedRows={tableState.selectedRows}
		deleteAction="?/delete"
		bulkDeleteAction="?/bulkDelete"
	>
		{#snippet actions(item)}
			<div class="flex gap-2">
				<Button size="icon" variant="ghost" onclick={() => handleEdit(item)} title="Edit">
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

	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={outletSchema}
		action="?/create"
		title="Create Outlet"
	/>

	{#if crudState.showEdit && crudState.editItem}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={outletSchema}
			action="?/update"
			title="Edit Outlet"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.name}
			title="Delete Outlet"
			description="Are you sure you want to delete this outlet?"
			action="?/delete"
		/>
	{/if}
</div>
