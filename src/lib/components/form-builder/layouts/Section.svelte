<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { SectionLayout } from '$lib/types/form-builder';

	let { config, renderItem }: { config: SectionLayout; renderItem: any } = $props();
</script>

<Card.Root class={config.class}>
	{#if config.title || config.description}
		<Card.Header>
			{#if config.title}
				<Card.Title>{config.title}</Card.Title>
			{/if}
			{#if config.description}
				<Card.Description>{config.description}</Card.Description>
			{/if}
		</Card.Header>
	{/if}
	<Card.Content class="grid gap-4">
		{#each config.children as item}
			{@render renderItem(item)}
		{/each}
	</Card.Content>
</Card.Root>
