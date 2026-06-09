<script lang="ts">
	import { Combobox } from '$lib/components/ui/combobox';

	let {
		name,
		label,
		items,
		value = $bindable(''),
		placeholder = 'Pilih opsi',
		searchPlaceholder = 'Cari...',
		emptyText = 'Data tidak ditemukan.',
		description,
		error,
		required = false,
		disabled = false,
		loading = false,
		onSelect
	}: {
		name: string;
		label: string;
		items: readonly { value: string; label: string }[];
		value?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		description?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		loading?: boolean;
		onSelect?: (value: string) => void | Promise<void>;
	} = $props();

	function handleSelect(selectedValue: string) {
		value = selectedValue;
		void onSelect?.(selectedValue);
	}
</script>

<div class="grid gap-2">
	<label for={`${name}-combobox`} class="text-sm font-semibold text-slate-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>

	<Combobox
		{items}
		{placeholder}
		{searchPlaceholder}
		{emptyText}
		bind:value
		{disabled}
		{loading}
		invalid={Boolean(error)}
		onSelect={handleSelect}
	/>
	<input id={`${name}-combobox`} type="hidden" {name} {value} {required} />

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{:else if description}
		<p class="text-xs leading-5 text-slate-500">{description}</p>
	{/if}
</div>
