<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import type { CheckboxFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable(false) }: { config: CheckboxFieldConfig; value: any } = $props();
</script>

<div class="flex items-center space-x-2 {config.class}">
	{#if config.type === 'switch'}
		<Switch
			id={config.name}
			name={config.name}
			checked={value}
			onCheckedChange={(v) => (value = v)}
			disabled={config.disabled}
		/>
	{:else}
		<Checkbox
			id={config.name}
			name={config.name}
			checked={value}
			onCheckedChange={(v) => (value = v)}
			disabled={config.disabled}
		/>
	{/if}

	<div class="grid gap-1.5 leading-none">
		<Label
			for={config.name}
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{config.label}
			{#if config.required}<span class="text-destructive">*</span>{/if}
		</Label>
		{#if config.description}
			<p class="text-sm text-muted-foreground">
				{config.description}
			</p>
		{/if}
	</div>
	<!-- Hidden input for form submission -->
	<input type="hidden" name={config.name} value={value ? 'true' : 'false'} />
</div>
