<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Eye, EyeOff } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type Props = Omit<HTMLInputAttributes, 'type' | 'files'>;

	let { class: className, value = $bindable(), ...restProps }: Props = $props();

	let showPassword = $state(false);
</script>

<div class="relative">
	<Input
		type={showPassword ? 'text' : 'password'}
		class={cn('pr-10', className)}
		bind:value
		{...restProps}
	/>
	<Button
		type="button"
		variant="ghost"
		size="icon-sm"
		class="absolute right-1 top-1/2 -translate-y-1/2"
		onclick={() => (showPassword = !showPassword)}
		aria-label={showPassword ? 'Hide password' : 'Show password'}
	>
		{#if showPassword}
			<EyeOff class="h-4 w-4" />
		{:else}
			<Eye class="h-4 w-4" />
		{/if}
	</Button>
</div>
