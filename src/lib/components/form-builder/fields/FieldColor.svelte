<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { ColorFieldConfig } from '$lib/types/form-builder';

	let {
		config,
		value = $bindable('')
	}: {
		config: ColorFieldConfig;
		value?: string;
	} = $props();
</script>

<div class="space-y-2 {config.class ?? ''}">
	{#if config.label}
		<Label for={config.name}>
			{config.label}
			{#if config.required}
				<span class="text-destructive">*</span>
			{/if}
		</Label>
	{/if}
	<div class="flex items-center gap-3">
		<div class="relative">
			<Input
				type="color"
				id={config.name}
				name={config.name}
				bind:value
				disabled={config.disabled}
				required={config.required}
				class="w-12 h-10 p-1 cursor-pointer"
			/>
		</div>
		<Input
			type="text"
			bind:value
			name={config.name + '_text'}
			placeholder="#000000"
			class="font-mono max-w-36"
			disabled={config.disabled}
		/>
		<div class="h-10 w-10 rounded-lg border shadow-inner shrink-0" style="background-color: {value || '#000000'}"></div>
	</div>
	{#if config.description}
		<p class="text-xs text-muted-foreground">{config.description}</p>
	{/if}
</div>
