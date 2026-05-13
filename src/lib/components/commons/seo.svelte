<script lang="ts">
	import { page } from '$app/stores';
	import { getSearchIndexingPolicy, buildGoogleTagManagerScript } from '$lib/utils/search-indexing';
	let {
		title = 'Nuwaira Academy',
		description = 'Leading Education & Training Provider for Students & Professionals',
		image = '/meta.png',
		url,
		type = 'website'
	}: {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
		type?: string;
	} = $props();

	let baseUrl = $derived(url || $page.url.origin);
	let indexingPolicy = $derived(getSearchIndexingPolicy($page.url));
	let displayTitle = $derived($page.url.pathname === '/' ? title : `${title} | Nuwaira Academy`);
	let absoluteImage = $derived(image.startsWith('http') ? image : new URL(image, baseUrl).href);
	let canonicalURL = $derived(new URL($page.url.pathname, baseUrl).href);
</script>

<svelte:head>
	{#if indexingPolicy.robotsMeta}
		<meta name="robots" content={indexingPolicy.robotsMeta} />
	{/if}
	{#if indexingPolicy.googleBotMeta}
		<meta name="googlebot" content={indexingPolicy.googleBotMeta} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalURL} />

	<!-- Primary Meta Tags -->
	<title>{displayTitle}</title>
	<meta name="title" content={displayTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalURL} />
	<meta property="og:title" content={displayTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={absoluteImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalURL} />
	<meta property="twitter:title" content={displayTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={absoluteImage} />
	<!-- Google tag (gtag.js) -->
	{#if indexingPolicy.gtagId}
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={indexingPolicy.gtagId}"
		></script>
		{@html buildGoogleTagManagerScript(indexingPolicy.gtagId)}
	{/if}
</svelte:head>
