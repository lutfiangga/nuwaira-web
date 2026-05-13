<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<main class="bg-white">
	{@render children()}
</main>
