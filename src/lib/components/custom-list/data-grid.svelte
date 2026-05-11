<script lang="ts" generics="T extends Record<string, any>">
	import { untrack } from 'svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import { Loader2 } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	import type { DataTableColumn } from '$lib/types/data-table';

	let {
		data,
		columns = [],
		renderCard
	}: {
		data: T[];
		columns?: DataTableColumn<T>[];
		renderCard: Snippet<[T]>;
	} = $props();

	// Derive searchable fields from columns
	const searchableFields = $derived(
		columns
			.filter((col) => col.searchable)
			.map((col) => col.accessorKey || col.id || '')
			.filter(Boolean) as string[]
	);

	// State
	let searchValue = $state('');
	let visibleCount = $state(12);
	let isLoadingMore = $state(false);
	
	// Filtering
	const filteredData = $derived.by(() => {
		let items = [...data];
		if (searchValue.trim()) {
			const term = searchValue.toLowerCase();
			items = items.filter((item) =>
				searchableFields.some((field) =>
					String(item[field] || '')
						.toLowerCase()
						.includes(term)
				)
			);
		}
		return items;
	});

	// Infinite Scroll Slicing
	const visibleData = $derived(filteredData.slice(0, visibleCount));
	const hasMore = $derived(visibleCount < filteredData.length);

	// Infinite Scroll Trigger
	function loadMore() {
		if (isLoadingMore || !hasMore) return;
		isLoadingMore = true;
		
		// Simulate network delay or just debounce slightly for UI feel
		setTimeout(() => {
			visibleCount += 12;
			isLoadingMore = false;
		}, 300);
	}

	// Intersection Observer for Infinite Scroll
	let observerEntry: HTMLDivElement;
	$effect(() => {
		if (!observerEntry) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) {
					loadMore();
				}
			},
			{ rootMargin: '100px' }
		);
		observer.observe(observerEntry);
		return () => observer.disconnect();
	});

	// Reset visible count on search change
	$effect(() => {
		searchValue;
		untrack(() => {
			visibleCount = 12;
		});
	});
</script>

<div class="space-y-6">
	<!-- Reusing standard Table Toolbar for search consistency -->
	<DataTableToolbar
		title="Filter Items"
		searchPlaceholder="Search..."
		bind:searchValue
		onSearch={() => {}}
		onClear={() => (searchValue = '')}
		hideViewOptions
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each visibleData as item (item.id || Math.random())}
			{@render renderCard(item)}
		{/each}
	</div>

	<!-- Loading / Trigger Area -->
	<div bind:this={observerEntry} class="w-full py-8 flex justify-center items-center text-muted-foreground min-h-[50px]">
		{#if isLoadingMore}
			<Loader2 class="animate-spin w-6 h-6" />
		{:else if !hasMore && filteredData.length > 0}
			<span class="text-sm">No more items to load</span>
		{:else if filteredData.length === 0}
			<span class="text-sm">No results found</span>
		{/if}
	</div>
</div>
