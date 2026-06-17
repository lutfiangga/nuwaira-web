<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/commons/navbar.svelte';

	let { children } = $props();

	const showNavbar = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/login') return false;
		if (path === '/register') return false;
		if (path.includes('/register')) return false;
		return true;
	});
</script>

{#if showNavbar}
	<Navbar />
{/if}
{@render children()}
