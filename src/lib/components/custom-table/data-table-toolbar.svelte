<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Settings2, Download, X, FileSpreadsheet, FileText, FileType } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';

	let {
		title = 'Data Management',
		searchPlaceholder = 'Search...',
		searchValue = $bindable(''),
		columns = $bindable({}),
		onSearch,
		onClear,
		onExport,
		exportFormats = ['csv', 'xlsx', 'pdf'] as ExportFormat[],
		onToggleColumn,
		hideViewOptions = false
	}: {
		title?: string;
		searchPlaceholder?: string;
		searchValue: string;
		columns: Record<string, boolean>;
		onSearch?: () => void;
		onClear?: () => void;
		onExport?: (format: ExportFormat) => void;
		exportFormats?: ExportFormat[];
		onToggleColumn?: (col: string) => void;
		hideViewOptions?: boolean;
	} = $props();

	const columnKeys = $derived(Object.keys(columns));

	// Format labels and icons
	const formatConfig: Record<ExportFormat, { label: string; icon: typeof FileText }> = {
		csv: { label: 'CSV (.csv)', icon: FileText },
		xlsx: { label: 'Excel (.xlsx)', icon: FileSpreadsheet },
		pdf: { label: 'PDF (.pdf)', icon: FileType }
	};
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
	<div class="flex items-center gap-2 flex-1">
		<div class="relative w-full max-w-sm">
			<Input
				type="text"
				placeholder={searchPlaceholder}
				bind:value={searchValue}
				class="pr-10"
				onkeydown={(e) => e.key === 'Enter' && onSearch?.()}
			/>
		</div>
		<Button variant="secondary" onclick={onSearch}>Search</Button>
		{#if searchValue}
			<Button
				variant="ghost"
				onclick={() => {
					searchValue = '';
					onClear?.();
				}}
			>
				Clear
				<X class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		{#if onExport && exportFormats.length > 0}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="sm" class="h-8 border-dashed">
						<Download class="mr-2 h-4 w-4" />
						Export
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>Export Format</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each exportFormats as format}
						{@const config = formatConfig[format]}
						<DropdownMenu.Item onclick={() => onExport(format)}>
							{#if format === 'csv'}
								<FileText class="mr-2 h-4 w-4" />
							{:else if format === 'xlsx'}
								<FileSpreadsheet class="mr-2 h-4 w-4" />
							{:else if format === 'pdf'}
								<FileType class="mr-2 h-4 w-4" />
							{/if}
							{config.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
		{#if !hideViewOptions}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline" size="sm" class="h-8 border-dashed">
					<Settings2 class="mr-2 h-4 w-4" />
					View
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-40">
				<DropdownMenu.Label>Show columns</DropdownMenu.Label>
				<DropdownMenu.Separator />
				{#each columnKeys as key}
					<DropdownMenu.CheckboxItem
						checked={columns[key]}
						onCheckedChange={() => onToggleColumn?.(key)}
					>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		{/if}
	</div>
</div>
