<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { TextFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: TextFieldConfig; value: any } = $props();
</script>

<div class="space-y-2 {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
	</Label>
	<Input
		id={config.name}
		name={config.name}
		type={config.type}
		placeholder={config.placeholder}
		required={config.required}
		disabled={config.disabled}
		step={config.step}
		min={config.min}
		max={config.max}
		bind:value
	/>
	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
