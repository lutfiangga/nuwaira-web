<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		viewAllHref,
		viewAllLabel = 'View All',
		children
	}: {
		title: string;
		subtitle?: string;
		viewAllHref: string;
		viewAllLabel?: string;
		children: Snippet;
	} = $props();
</script>

<div class="rounded-2xl border bg-card overflow-hidden">
	<div class="flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent border-b px-5 py-4">
		<div>
			<h2 class="font-semibold">{title}</h2>
			{#if subtitle}
				<p class="text-sm text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		<Button variant="outline" size="sm" href={viewAllHref} class="rounded-lg">{viewAllLabel}</Button>
	</div>
	<div class="overflow-x-auto">
		{@render children()}
	</div>
</div>
