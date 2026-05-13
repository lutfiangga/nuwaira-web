<script lang="ts">
	import './layout.css';
	import favicon from '/images/logo-icon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<main class="bg-white">
	{@render children()}
</main>
