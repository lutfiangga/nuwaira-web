<script lang="ts">
	import PanelShell from '$lib/components/panel-shell.svelte';

	let { data, children } = $props();
</script>

<PanelShell {data}>
	{@render children?.()}
</PanelShell>
