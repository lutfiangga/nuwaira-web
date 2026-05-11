<script lang="ts">
	import type { ComboboxFieldConfig } from '$lib/types/form-builder';
	import { Label } from '$lib/components/ui/label';
	import { Combobox } from '$lib/components/ui/combobox';

	let {
		config,
		value = $bindable()
	}: {
		config: ComboboxFieldConfig;
		value?: string;
	} = $props();

	// Ensure value is always a string
	let localValue = $state(value || '');

	// Sync localValue with value prop
	$effect(() => {
		localValue = value || '';
	});

	async function handleSelect(selectedValue: string) {
		localValue = selectedValue;
		value = selectedValue;
		if (config.onSelect) {
			await config.onSelect(selectedValue);
		}
	}
</script>

<div class="space-y-2 w-full {config.class || ''}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}
			<span class="text-destructive">*</span>
		{/if}
	</Label>
	<Combobox
		items={config.options}
		placeholder={config.placeholder || `Select ${config.label.toLowerCase()}...`}
		bind:value={localValue}
		disabled={config.disabled}
		onSelect={handleSelect}
	/>
	<input type="hidden" name={config.name} value={localValue} />
	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
