<script lang="ts">
	import { getTechnologyIcon } from '$lib/program-technologies';

	let {
		iconKey,
		svg: propSvg,
		class: className = 'size-5'
	}: { iconKey: string; svg?: string | null; class?: string } = $props();

	const svg = $derived(propSvg ?? getTechnologyIcon(iconKey));
</script>

{#if svg}
	<span class={className} aria-hidden="true">
		{@html svg}
	</span>
{/if}

<style>
	span :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
