<script lang="ts">
	import AcaraDetailSection from '$lib/sections/acara/acara-detail-section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.event.title} | Nuwaira Academy</title>
	<meta name="description" content={data.event.description ?? data.event.title} />
	<meta property="og:title" content={data.event.title} />
	<meta property="og:description" content={data.event.description ?? data.event.title} />
	{#if data.event.imageUrl}
		<meta property="og:image" content={data.event.imageUrl} />
	{/if}
</svelte:head>

<AcaraDetailSection event={data.event} />
