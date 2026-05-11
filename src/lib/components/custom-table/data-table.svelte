<script lang="ts" generics="T extends DataItem">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { ChevronUp, ChevronDown, Image } from '@lucide/svelte';
	import type { DataItem, DataTableColumn } from '$lib/types/data-table';
	import type { Snippet } from 'svelte';
	import DataTableImagePreview from './data-table-image-preview.svelte';

	let {
		data,
		columns,
		visibleColumns = $bindable({}),
		searchTerm = '',
		searchableFields = ['id'],
		sortColumn = $bindable(''),
		sortOrder = $bindable<'asc' | 'desc'>('asc'),
		selectedRows = $bindable({}),
		currentPage = $bindable(1),
		perPage = $bindable(5),
		bulkDeleteAction = '?/bulkDelete',
		actions
	}: {
		data: T[];
		columns: DataTableColumn<T>[];
		visibleColumns?: Record<string, boolean>;
		searchTerm?: string;
		searchableFields?: string[];
		sortColumn?: string;
		sortOrder?: 'asc' | 'desc';
		selectedRows?: Record<string, boolean>;
		currentPage?: number;
		perPage?: number;
		bulkDeleteAction?: string;
		actions?: Snippet<[T]>;
	} = $props();

	// Initialize sort column if empty
	$effect(() => {
		if (!sortColumn) {
			const firstSortable = columns.find((c) => c.sortable);
			if (firstSortable) sortColumn = firstSortable.accessorKey || firstSortable.id || '';
		}
	});

	// Filter visible columns
	const activeColumns = $derived(
		columns.filter((col) => {
			const id = col.id || col.accessorKey;
			return id && visibleColumns[id] !== false;
		})
	);

	// Computed values
	const finalSearchableFields = $derived(
		searchableFields.length > 0
			? searchableFields
			: (columns
					.filter((c) => c.searchable)
					.map((c) => c.accessorKey || c.id || '')
					.filter(Boolean) as string[])
	);

	const processedData = $derived(() => {
		let items = [...data];

		// Apply search filter
		if (searchTerm.trim() && finalSearchableFields.length > 0) {
			const term = searchTerm.toLowerCase();
			items = items.filter((item) =>
				finalSearchableFields.some((field) =>
					String(item[field] || '')
						.toLowerCase()
						.includes(term)
				)
			);
		}

		// Apply sorting
		if (sortColumn) {
			items.sort((a, b) => {
				let aVal = a[sortColumn];
				let bVal = b[sortColumn];

				if (aVal == null) return 1;
				if (bVal == null) return -1;

				if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
				if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return items;
	});

	const filteredData = $derived(processedData());

	// Pagination
	const totalPages = $derived(Math.ceil(filteredData.length / perPage));
	const startIndex = $derived((currentPage - 1) * perPage);
	const endIndex = $derived(Math.min(startIndex + perPage, filteredData.length));
	const currentData = $derived(filteredData.slice(startIndex, endIndex));

	const selectedCount = $derived(Object.values(selectedRows).filter(Boolean).length);

	const selectedIds = $derived(Object.keys(selectedRows).filter((k) => selectedRows[k]));

	const allSelected = $derived(
		currentData.length > 0 && currentData.every((item) => selectedRows[item.id] === true)
	);

	function toggleSort(column: DataTableColumn<T>) {
		const key = column.accessorKey || column.id;
		if (!key) return;

		if (sortColumn === key) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = key;
			sortOrder = 'asc';
		}
	}

	function toggleAllRows(checked: boolean) {
		const newSelected: Record<string, boolean> = { ...selectedRows };
		currentData.forEach((item) => {
			newSelected[item.id] = checked;
		});
		selectedRows = newSelected;
	}

	function toggleRowSelection(itemId: string, checked: boolean) {
		selectedRows = { ...selectedRows, [itemId]: checked };
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function changePerPage(value: number) {
		perPage = value;
		currentPage = 1;
	}

	function formatValue(item: T, column: DataTableColumn<T>): string {
		if (!column.accessorKey) return '';
		const value = item[column.accessorKey];

		if (column.format) {
			return column.format(value, item);
		}

		if (column.type === 'password') {
			return '•••••••';
		}

		if (column.type === 'date' && value) {
			try {
				return new Date(value).toLocaleString('id-ID');
			} catch {
				return String(value);
			}
		}

		return String(value ?? '');
	}

	// Track image load errors
	let imageErrors = $state<Record<string, boolean>>({});

	// Image Preview State
	let showPreview = $state(false);
	let previewImages = $state<string[]>([]);

	function openPreview(value: string | string[]) {
		if (Array.isArray(value)) {
			previewImages = value;
		} else if (typeof value === 'string') {
			previewImages = [value];
		}
		if (previewImages.length > 0) {
			showPreview = true;
		}
	}
</script>

<DataTableImagePreview bind:open={showPreview} images={previewImages} />

<div class="space-y-4">
	<!-- Bulk delete -->
	{#if selectedCount > 0}
		<form method="post" action={bulkDeleteAction} use:enhance>
			<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
			<Button variant="destructive">
				Delete Selected ({selectedCount})
			</Button>
		</form>
	{/if}

	<!-- Table -->
	<div class="rounded-md border w-full overflow-x-auto">
		<Table.Root class="w-full">
			<Table.Header>
				<Table.Row>
					{#each activeColumns as column}
						{#if column.type === 'select'}
							<Table.Head class="w-[50px]">
								<Checkbox
									onCheckedChange={(checked) => toggleAllRows(checked ?? false)}
									checked={allSelected}
								/>
							</Table.Head>
						{:else if column.type === 'actions'}
							<Table.Head class="w-[100px]">Actions</Table.Head>
						{:else}
							<Table.Head
								class={column.sortable !== false ? 'cursor-pointer' : ''}
								onclick={() => column.sortable !== false && toggleSort(column)}
							>
								{column.label}
								{#if column.sortable !== false && sortColumn === (column.accessorKey || column.id)}
									{#if sortOrder === 'asc'}
										<ChevronUp class="inline-block w-4 h-4 ml-1" />
									{:else}
										<ChevronDown class="inline-block w-4 h-4 ml-1" />
									{/if}
								{/if}
							</Table.Head>
						{/if}
					{/each}
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each currentData as item (item.id)}
					<Table.Row>
						{#each activeColumns as column}
							{#if column.type === 'select'}
								<Table.Cell>
									<Checkbox
										checked={selectedRows[item.id] ?? false}
										onCheckedChange={(checked) => toggleRowSelection(item.id, checked ?? false)}
									/>
								</Table.Cell>
							{:else if column.type === 'actions'}
								<Table.Cell>
									{#if actions}
										{@render actions(item)}
									{/if}
								</Table.Cell>
							{:else if column.type === 'image'}
								<Table.Cell>
									{#if column.accessorKey && item[column.accessorKey] && !imageErrors[`${item.id}-${column.accessorKey}`]}
										<button
											type="button"
											class="cursor-pointer hover:opacity-80 transition-opacity"
											onclick={() => openPreview(item[column.accessorKey!])}
										>
											<img
												src={Array.isArray(item[column.accessorKey!])
													? item[column.accessorKey!][0]
													: item[column.accessorKey!]}
												alt="Item"
												class="h-10 w-10 object-cover rounded bg-muted aspect-square"
												onerror={() => {
													if (column.accessorKey) {
														imageErrors[`${item.id}-${column.accessorKey}`] = true;
													}
												}}
											/>
										</button>
									{:else}
										<div class="h-10 w-10 rounded bg-muted flex items-center justify-center">
											<Image class="w-5 h-5 text-muted-foreground" />
										</div>
									{/if}
								</Table.Cell>
							{:else}
								<Table.Cell>
									{formatValue(item, column)}
								</Table.Cell>
							{/if}
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination logic omitted for brevity, adding back same logic as before -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-sm text-muted-foreground">Rows per page:</span>
			<select
				value={perPage}
				onchange={(e) => changePerPage(Number(e.currentTarget.value))}
				class="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
			>
				<option value={5}>5</option>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
		</div>

		<div class="text-sm text-muted-foreground">
			Showing {startIndex + 1} to {endIndex} of {filteredData.length}
			{#if filteredData.length !== data.length}
				(filtered from {data.length} total)
			{/if}
		</div>

		<div class="flex items-center gap-4">
			{#if totalPages > 1}
				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onclick={() => goToPage(1)}
						disabled={currentPage === 1}
					>
						First
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<span class="text-sm text-muted-foreground px-2">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						onclick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => goToPage(totalPages)}
						disabled={currentPage === totalPages}
					>
						Last
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
