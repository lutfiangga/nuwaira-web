<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let {
		items = [],
		placeholder = 'Select...',
		searchPlaceholder = 'Search...',
		emptyText = 'No results found.',
		value = $bindable(''),
		disabled = false,
		loading = false,
		invalid = false,
		class: className,
		contentClass,
		onSelect = () => {}
	}: {
		items: readonly { value: string; label: string }[];
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		value?: string;
		disabled?: boolean;
		loading?: boolean;
		invalid?: boolean;
		class?: string;
		contentClass?: string;
		onSelect?: (value: string) => void;
	} = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(items.find((f) => f.value === value)?.label);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	function handleSelect(selectedValue: string) {
		value = selectedValue;
		onSelect(selectedValue);
		closeAndFocusTrigger();
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class={cn(
					'h-12 w-full justify-between rounded-xl border-slate-200 bg-white px-4 text-left font-normal shadow-none hover:bg-slate-50',
					!selectedValue && 'text-slate-400',
					invalid && 'border-red-400 ring-2 ring-red-100',
					className
				)}
				{...props}
				role="combobox"
				aria-expanded={open}
				aria-invalid={invalid}
				disabled={disabled || loading}
			>
				<span class="truncate">{loading ? 'Loading...' : selectedValue || placeholder}</span>
				<ChevronsUpDownIcon class="ms-2 size-4 shrink-0 text-slate-400" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		align="start"
		class={cn(
			'w-[var(--bits-popover-anchor-width)] min-w-[260px] overflow-hidden rounded-xl border-slate-200 p-0 shadow-xl',
			contentClass
		)}
	>
		<Command.Root>
			<Command.Input placeholder={searchPlaceholder} />
			<Command.List class="max-h-64 p-1">
				<Command.Empty class="py-8 text-center text-sm text-slate-500">{emptyText}</Command.Empty>
				<Command.Group>
					{#each items as item (item.value)}
						<Command.Item
							value={item.value}
							keywords={[item.label]}
							class="rounded-lg px-3 py-2.5"
							onSelect={() => {
								handleSelect(item.value);
							}}
						>
							<CheckIcon class={cn('me-2 size-4', value !== item.value && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
