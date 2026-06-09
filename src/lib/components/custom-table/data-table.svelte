<script lang="ts" generics="T extends DataItem">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Download, Eye, Search, Plus, ChevronUp, ChevronDown, Trash2, Image as ImageIcon } from '@lucide/svelte';
	import type { DataItem, DataTableColumn } from '$lib/types/data-table';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import type { Snippet, Component } from 'svelte';
	import { onDestroy } from 'svelte';
	import DataTableImagePreview from './data-table-image-preview.svelte';

	let {
		data,
		columns,
		total,
		title,
		subtitle,
		icon: Icon,
		totalLabel,
		totalValue,
		basePath,
		page = 1,
		pageSize = $bindable(10),
		search = '',
		sortColumn = '',
		sortOrder = 'asc',
		searchPlaceholder = 'Cari...',
		visibleColumns = {},
		selectedIds = [],
		createLabel,
		bulkDeleteAction,
		onSearch = () => {},
		onPageChange = () => {},
		onExport,
		onToggleColumn,
		onToggleSelect,
		onSelectAll,
		onCreate,
		actions,
		cell
	}: {
		data: T[];
		columns: DataTableColumn<T>[];
		total: number;
		title: string;
		subtitle: string;
		icon: Component;
		totalLabel: string;
		totalValue: number;
		basePath: string;
		page?: number;
		pageSize?: number;
		search?: string;
		sortColumn?: string;
		sortOrder?: 'asc' | 'desc';
		searchPlaceholder?: string;
		visibleColumns?: Record<string, boolean>;
		selectedIds?: string[];
		createLabel?: string;
		bulkDeleteAction?: string;
		onSearch?: (value: string) => void;
		onPageChange?: (page: number) => void;
		onExport?: (format: ExportFormat) => void;
		onToggleColumn?: (key: string) => void;
		onToggleSelect?: (id: string, checked: boolean) => void;
		onSelectAll?: (checked: boolean) => void;
		onCreate?: () => void;
		actions?: Snippet<[T]>;
		cell?: Snippet<[string, T]>;
	} = $props();

	const totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));

	const activeColumns = $derived(
		columns.filter((col) => {
			const key = col.id || col.accessorKey;
			if (!key) return false;
			if (col.hidden) return false;
			return visibleColumns[key] !== false;
		})
	);

	const allSelected = $derived(
		data.length > 0 && data.every((item) => selectedIds.includes(item.id))
	);
	const someSelected = $derived(
		data.some((item) => selectedIds.includes(item.id)) && !allSelected
	);

	let internalSearch = $state('');
	let searchForm: HTMLFormElement;
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => { internalSearch = search; });

	function scheduleSearch() {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => searchForm?.requestSubmit(), 500);
	}

	onDestroy(() => { if (searchTimer) clearTimeout(searchTimer); });

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) onPageChange(newPage);
	}

	function toggleAll(checked: boolean) {
		onSelectAll?.(checked);
	}

	function formatCell(item: T, col: DataTableColumn<T>): string {
		if (!col.accessorKey) return '';
		const value = item[col.accessorKey];
		if (col.format) return col.format(value, item);
		if (col.type === 'password') return '•••••••';
		if (col.type === 'date' && value) {
			try { return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
			catch { return String(value); }
		}
		return String(value ?? '');
	}

	// Image preview state
	let showPreview = $state(false);
	let previewImages = $state<string[]>([]);
	let imageErrors = $state<Record<string, boolean>>({});

	function openPreview(value: string | string[]) {
		if (Array.isArray(value)) previewImages = value;
		else if (typeof value === 'string') previewImages = [value];
		if (previewImages.length > 0) showPreview = true;
	}
</script>

<DataTableImagePreview bind:open={showPreview} images={previewImages} />

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div>
				<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
					<Icon class="size-5" /> {title}
				</div>
				<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">{subtitle}</h2>
			</div>
			<div class="flex items-end gap-3">
				<div class="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
					<p class="text-xs uppercase tracking-[0.16em] text-white/60">{totalLabel}</p>
					<p class="mt-1 text-3xl font-semibold">{totalValue}</p>
				</div>
				{#if createLabel && onCreate}
					<Button type="button" variant="secondary" class="h-12 rounded-xl bg-white px-5 text-brand hover:bg-blue-50" onclick={onCreate}>
						<Plus class="size-4" /> {createLabel}
					</Button>
				{/if}
			</div>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<div class="flex flex-col gap-3 lg:flex-row">
			<form bind:this={searchForm} class="flex flex-1 flex-col gap-3 sm:flex-row" method="GET" action={basePath}>
				<input type="hidden" name="page" value="1" />
				<input type="hidden" name="pageSize" value={pageSize} />
				<input type="hidden" name="sort" value={sortColumn} />
				<input type="hidden" name="order" value={sortOrder} />
				<div class="relative flex-1">
					<Search class="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
					<Input name="search" bind:value={internalSearch} oninput={scheduleSearch} placeholder={searchPlaceholder} class="h-12 rounded-xl border-slate-200 pl-11 shadow-none" />
				</div>
				<Button type="submit" class="bg-brand h-12 rounded-xl px-7 text-white">Cari</Button>
			</form>
			{#if onExport}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} type="button" variant="outline" class="h-12 rounded-xl px-5">
								<Download class="size-4" /> Export
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item onclick={() => onExport('csv')}>CSV (.csv)</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => onExport('xlsx')}>Excel (.xlsx)</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => onExport('pdf')}>PDF (.pdf)</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
			{#if onToggleColumn}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} type="button" variant="outline" class="h-12 rounded-xl px-5">
								<Eye class="size-4" /> Tampilkan kolom
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-52">
						<DropdownMenu.Label>Kolom tabel</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#each Object.entries(visibleColumns) as [key, val]}
							<DropdownMenu.CheckboxItem checked={val} onCheckedChange={() => onToggleColumn(key)}>
								{columns.find((c) => c.id === key || c.accessorKey === key)?.label || key}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</section>

	{#if selectedIds.length > 0}
		<section class="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-sm font-medium text-red-800">{selectedIds.length} item dipilih</p>
			{#if bulkDeleteAction}
				<form method="POST" action={bulkDeleteAction} onsubmit={(e) => { if (!confirm(`Hapus ${selectedIds.length} item terpilih?`)) e.preventDefault(); }}>
					<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
					<Button type="submit" variant="destructive" class="rounded-xl">
						<Trash2 class="size-4" /> Hapus terpilih
					</Button>
				</form>
			{/if}
		</section>
	{/if}

	<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead class="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
					<tr>
						{#each activeColumns as column}
							{@const key = column.id || column.accessorKey || ''}
							{#if column.type === 'select'}
								<th class="w-14 px-6 py-4">
									<Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={(c) => toggleAll(c === true)} />
								</th>
							{:else if column.type === 'actions'}
								<th class="w-24 px-6 py-4 font-semibold">Aksi</th>
							{:else if column.sortable !== false && key}
								<th class={['px-6 py-4 font-semibold', column.headerClassName || '']}>
									<form method="GET" action={basePath} class="inline">
										<input type="hidden" name="search" value={search} />
										<input type="hidden" name="page" value="1" />
										<input type="hidden" name="pageSize" value={pageSize} />
										<input type="hidden" name="sort" value={key} />
										<input type="hidden" name="order" value={sortColumn === key && sortOrder === 'asc' ? 'desc' : 'asc'} />
										<button type="submit" class="inline-flex items-center gap-1 font-semibold cursor-pointer hover:text-slate-700">
											{column.label || key}
											{#if sortColumn === key}
												{#if sortOrder === 'asc'}
													<ChevronUp class="size-3.5" />
												{:else}
													<ChevronDown class="size-3.5" />
												{/if}
											{/if}
										</button>
									</form>
								</th>
							{:else}
								<th class={['px-6 py-4 font-semibold', column.headerClassName || '']}>{column.label || key}</th>
							{/if}
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#each data as item (item.id)}
						<tr class="transition hover:bg-blue-50/40">
							{#each activeColumns as column}
								{@const key = column.id || column.accessorKey || ''}
								{#if column.type === 'select'}
									<td class="px-6 py-5">
										<Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={(c) => onToggleSelect?.(item.id, c === true)} />
									</td>
								{:else if column.type === 'actions'}
									<td class="px-6 py-5">
										{#if actions}
											{@render actions(item)}
										{/if}
									</td>
								{:else if column.type === 'image'}
									<td class="px-6 py-5">
										{#if column.accessorKey && item[column.accessorKey] && !imageErrors[`${item.id}-${column.accessorKey}`]}
											<button type="button" class="cursor-pointer" onclick={() => openPreview(item[column.accessorKey!])}>
												<img
													src={Array.isArray(item[column.accessorKey!]) ? item[column.accessorKey!][0] : item[column.accessorKey!]}
													alt=""
													class="size-11 rounded-xl object-cover"
													onerror={() => { if (column.accessorKey) imageErrors[`${item.id}-${column.accessorKey}`] = true; }}
												/>
											</button>
										{:else}
											<div class="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-brand">
												<ImageIcon class="size-5" />
											</div>
										{/if}
									</td>
								{:else if column.type === 'password'}
									<td class="px-6 py-5 text-slate-700">•••••••</td>
								{:else if cell && column.customCell}
									<td class="px-6 py-5">
										{@render cell(key, item)}
									</td>
								{:else}
									<td class="px-6 py-5">
										{formatCell(item, column)}
									</td>
								{/if}
							{/each}
						</tr>
					{:else}
						<tr>
							<td colspan={activeColumns.length} class="px-6 py-16 text-center text-slate-500">
								Belum ada data yang cocok.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
			<form method="GET" action={basePath} class="flex items-center gap-2">
				<input type="hidden" name="search" value={search} />
				<input type="hidden" name="page" value="1" />
				<input type="hidden" name="sort" value={sortColumn} />
				<input type="hidden" name="order" value={sortOrder} />
				<span class="text-sm text-slate-500">Baris per halaman:</span>
				<select
					name="pageSize"
					value={pageSize}
					onchange={(e) => { const form = (e.target as HTMLSelectElement).form; if (form) form.requestSubmit(); }}
					class="flex h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
			</form>
			<p class="text-sm text-slate-500">Halaman {page} dari {totalPages}</p>
			<div class="flex gap-2">
				<form method="GET" action={basePath}>
					<input type="hidden" name="search" value={search} />
					<input type="hidden" name="page" value={page - 1} />
					<input type="hidden" name="pageSize" value={pageSize} />
					<input type="hidden" name="sort" value={sortColumn} />
					<input type="hidden" name="order" value={sortOrder} />
					<Button type="submit" variant="outline" disabled={page <= 1} class="rounded-xl">Sebelumnya</Button>
				</form>
				<form method="GET" action={basePath}>
					<input type="hidden" name="search" value={search} />
					<input type="hidden" name="page" value={page + 1} />
					<input type="hidden" name="pageSize" value={pageSize} />
					<input type="hidden" name="sort" value={sortColumn} />
					<input type="hidden" name="order" value={sortOrder} />
					<Button type="submit" variant="outline" disabled={page >= totalPages} class="rounded-xl">Berikutnya</Button>
				</form>
			</div>
		</div>
	</section>
</div>
