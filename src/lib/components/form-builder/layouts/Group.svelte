<script lang="ts">
	import type { GroupLayout } from '$lib/types/form-builder';

	let { config, renderItem }: { config: GroupLayout; renderItem: any } = $props();
</script>

<div class="space-y-4 {config.class}">
	{#each config.children as item}
		{@render renderItem(item)}
	{/each}
</div>
