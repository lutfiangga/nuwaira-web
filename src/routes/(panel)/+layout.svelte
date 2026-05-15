<script lang="ts">
	import DashboardLayout from './panel-layout.svelte';

	let { data, children } = $props();
</script>

<DashboardLayout {data}>
	{@render children()}
</DashboardLayout>
