<script lang="ts">
	import Seo from '$lib/components/commons/seo.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<Seo />
</svelte:head>
<main class="bg-white">
	{@render children()}
</main>
