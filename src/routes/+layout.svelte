<script lang="ts">
	import Seo from '$lib/components/commons/seo.svelte';
	import './layout.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const brandColor = $derived(data?.brand?.brandColor || '#092A77');
	const brandName = $derived(data?.brand?.brandName || 'Nuwaira Academy');
	const brandFavicon = $derived(data?.brand?.brandFavicon || '/images/logo-icon.svg');
</script>

<svelte:head>
	<Seo
		title={data?.brand?.seoTitle || undefined}
		description={data?.brand?.seoDescription || undefined}
		image={data?.brand?.seoOgImage || '/images/meta.png'}
	/>
	<link rel="icon" href={brandFavicon} type="image/svg+xml" />
</svelte:head>

<main style="--brand-blue: {brandColor}; --primary: {brandColor}; --ring: {brandColor}; --sidebar-primary: {brandColor}">
	{@render children?.()}
</main>
