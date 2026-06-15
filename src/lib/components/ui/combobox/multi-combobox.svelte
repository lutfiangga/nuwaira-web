<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import BrandIcon from '$lib/components/icons/brand-icon.svelte';
	import { cn } from '$lib/utils.js';

	type Item = { value: string; label: string; iconKey?: string; svg?: string };

	let {
		items = [],
		placeholder = 'Pilih beberapa item...',
		searchPlaceholder = 'Cari...',
		emptyText = 'Tidak ada hasil.',
		values = $bindable([]),
		name,
		disabled = false,
		class: className
	}: {
		items: readonly Item[];
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		values?: string[];
		name?: string;
		disabled?: boolean;
		class?: string;
	} = $props();

	let open = $state(false);
	let searchQuery = $state('');

	const selectedItems = $derived(items.filter((item) => values.includes(item.value)));

	const filteredItems = $derived(() => {
		if (!searchQuery) return [];
		const q = searchQuery.toLowerCase();
		return items.filter(
			(item) =>
				item.label.toLowerCase().includes(q) ||
				item.value.toLowerCase().includes(q)
		).slice(0, 100);
	});

	function toggle(value: string) {
		values = values.includes(value)
			? values.filter((selected) => selected !== value)
			: [...values, value];
	}
</script>

{#if name}
	{#each values as value (value)}
		<input type="hidden" {name} {value} />
	{/each}
{/if}

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				type="button"
				class={cn(
					'h-auto min-h-10 w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-left text-sm font-medium shadow-none hover:bg-slate-50',
					className
				)}
				{...props}
				role="combobox"
				aria-expanded={open}
				{disabled}
			>
				{#if selectedItems.length}
					<span class="flex min-w-0 flex-1 flex-wrap gap-1.5">
						{#each selectedItems as item (item.value)}
							<span
								class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
							>
								{#if item.iconKey}
									<BrandIcon iconKey={item.iconKey} svg={item.svg} class="size-3.5" />
								{/if}
								{item.label}
								<button
									type="button"
									class="rounded-sm text-slate-400 hover:text-slate-700"
									aria-label={`Hapus ${item.label}`}
									onclick={(event) => {
										event.stopPropagation();
										toggle(item.value);
									}}
								>
									<XIcon class="size-3" />
								</button>
							</span>
						{/each}
					</span>
				{:else}
					<span class="text-sm text-slate-400">{placeholder}</span>
				{/if}
				<ChevronsUpDownIcon class="ms-2 size-4 shrink-0 text-slate-400" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		align="start"
		class="w-[var(--bits-popover-anchor-width)] min-w-[300px] overflow-hidden rounded-xl border-slate-200 p-0 shadow-xl"
	>
		<Command.Root>
			<Command.Input
				placeholder={searchPlaceholder}
				oninput={(e: Event) => {
					searchQuery = (e.target as HTMLInputElement).value;
				}}
			/>
			<Command.List class="max-h-72 p-1">
				{#if !searchQuery}
					<div class="py-8 text-center text-sm text-slate-400">
						Ketik untuk mencari icon...
					</div>
				{:else if filteredItems().length === 0}
					<Command.Empty class="py-8 text-center text-sm text-slate-500">{emptyText}</Command.Empty>
				{:else}
					<Command.Group>
						{#each filteredItems() as item (item.value)}
							<Command.Item
								value={item.value}
								keywords={[item.label]}
								class="rounded-lg px-3 py-2.5"
								onSelect={() => toggle(item.value)}
							>
								<CheckIcon
									class={cn('me-1 size-4', !values.includes(item.value) && 'text-transparent')}
								/>
								{#if item.iconKey}
									<BrandIcon iconKey={item.iconKey} svg={item.svg} class="size-5" />
								{/if}
								<span>{item.label}</span>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
