<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import type { SelectFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: SelectFieldConfig; value: any } = $props();

	// Compute display value
	let displayValue = $derived(
		config.options.find((o) => o.value == value)?.label || config.placeholder || 'Select an option'
	);
</script>

<div class="space-y-2 w-full {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
	</Label>

	<input type="hidden" name={config.name} bind:value />

	<Select.Root type="single" bind:value>
		<Select.Trigger class="w-full" id={config.name}>
			{displayValue}
		</Select.Trigger>
		<Select.Content>
			{#each config.options as option}
				<Select.Item value={option.value.toString()} label={option.label}>
					{option.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
