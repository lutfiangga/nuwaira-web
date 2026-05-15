<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Eye, EyeOff } from '@lucide/svelte';
	import type { TextFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: TextFieldConfig; value: any } = $props();

	let showPassword = $state(false);
	const isPassword = $derived(config.type === 'password');
</script>

<div class="space-y-2 {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
	</Label>
	<div class="relative">
		<Input
			id={config.name}
			name={config.name}
			type={isPassword && !showPassword ? 'password' : 'text'}
			placeholder={config.placeholder}
			required={config.required}
			disabled={config.disabled}
			step={config.step}
			min={config.min}
			max={config.max}
			bind:value
			class={isPassword ? 'pr-10' : ''}
		/>
		{#if isPassword}
			<Button
				type="button"
				variant="ghost"
				size="icon"
				class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
				onclick={() => (showPassword = !showPassword)}
			>
				{#if showPassword}
					<EyeOff class="h-4 w-4" />
				{:else}
					<Eye class="h-4 w-4" />
				{/if}
			</Button>
		{/if}
	</div>
	{#if config.description}
		<p class="text-xs text-muted-foreground">{config.description}</p>
	{/if}
</div>
