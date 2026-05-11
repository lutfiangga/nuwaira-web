<script lang="ts">
	import type { GridLayout, FormSchemaItem } from '$lib/types/form-builder';
	// We need to import the recursive renderer, but circular dependency might be tricky in Svelte 5 snippets?
	// Actually, we can pass a snippet from the parent or just use the FormBuilder recursively?
	// Ideally, FormBuilder should expose a way, or we just import a "FormRenderer" component
	// For now, I will assume the parent passes a snippet for children rendering or I import a simpler renderer.

	// Simplest approach: The Layout component receives children and a "render" snippet.

	let { config, renderItem }: { config: GridLayout; renderItem: any } = $props();

	function getGridCols(cols: GridLayout['columns']) {
		if (!cols) return 'grid-cols-1';
		if (typeof cols === 'number') return `grid-cols-${cols}`;
		// Complex object logic could be added here for responsive classes
		// For simplicity, defaulting to explicit classes for tailwind to pick up
		// NOTE: Tailwind needs full class names. Dynamic string concatenation might fail if classes aren't purged safe.
		// Assuming user passes safe numbers: 1-12.

		let classes = [];
		if (cols.default) classes.push(`grid-cols-${cols.default}`);
		if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
		if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
		if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);

		return classes.join(' ') || 'grid-cols-1';
	}
</script>

<div class="grid gap-4 {getGridCols(config.columns)} {config.class}">
	{#each config.children as item}
		{@render renderItem(item)}
	{/each}
</div>
