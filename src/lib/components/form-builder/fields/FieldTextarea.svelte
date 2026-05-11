<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import type { TextareaFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: TextareaFieldConfig; value: any } = $props();
</script>

<div class="space-y-2 {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
	</Label>
	<Textarea
		id={config.name}
		name={config.name}
		placeholder={config.placeholder}
		required={config.required}
		disabled={config.disabled}
		rows={config.rows || 4}
		bind:value
	/>
	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
