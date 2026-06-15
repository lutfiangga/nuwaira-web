<script lang="ts">
	import Seo from '$lib/components/commons/seo.svelte';
	import './layout.css';
	import type { LayoutData } from './$types';
	import Footer from '$lib/sections/commons/footer.svelte';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const brandFavicon = '/images/logo-icon.svg';

	const showFooter = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/') return true;
		if (path.startsWith('/programs/')) return true;
		return false;
	});
</script>

<svelte:head>
	<Seo
		title="Nuwaira Academy"
		description="Leading Education & Training Provider for Students & Professionals"
		image="/images/meta.png"
	/>
	<link rel="icon" href={brandFavicon} type="image/svg+xml" />
</svelte:head>

<main class="bg-white">
	{@render children?.()}
	{#if showFooter}
		<Footer />
	{/if}
</main>
