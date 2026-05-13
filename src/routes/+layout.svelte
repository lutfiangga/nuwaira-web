<script lang="ts">
	import Seo from '$lib/components/commons/seo.svelte';
	import './layout.css';
	import favicon from '/images/logo-icon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<Seo />
</svelte:head>
<main class="bg-white">
	{@render children()}
</main>
