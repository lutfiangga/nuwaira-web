<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		images = [],
		children
	}: {
		open: boolean;
		title?: string;
		images?: string | string[];
		children?: Snippet;
	} = $props();

	// Normalizing images to array
	let imageList = $derived(Array.isArray(images) ? images : images ? [images] : []);
	let currentIndex = $state(0);

	function nextImage() {
		if (imageList.length > 0) {
			currentIndex = (currentIndex + 1) % imageList.length;
		}
	}

	function prevImage() {
		if (imageList.length > 0) {
			currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
		}
	}

	// Reset index when dialog opens or images change
	$effect(() => {
		if (open) {
			currentIndex = 0;
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-3xl p-0 overflow-hidden gap-0">
		<div class="relative w-full aspect-video bg-black/5 flex items-center justify-center">
			{#if imageList.length > 0}
				<!-- Main Image -->
				<img
					src={imageList[currentIndex]}
					alt={title}
					class="w-full h-full object-contain"
				/>

				<!-- Controls -->
				{#if imageList.length > 1}
					<Button
						variant="ghost"
						size="icon"
						class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
						onclick={prevImage}
					>
						<ChevronLeft class="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
						onclick={nextImage}
					>
						<ChevronRight class="h-6 w-6" />
					</Button>

					<!-- Indicator -->
					<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
						{#each imageList as _, i}
							<div
								class="w-2 h-2 rounded-full transition-colors {i === currentIndex
									? 'bg-white'
									: 'bg-white/50'}"
							></div>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="text-muted-foreground flex flex-col items-center">
					<span>No Image</span>
				</div>
			{/if}
			
			<Dialog.Close class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-black/20 text-white p-1">
				<X class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</Dialog.Close>
		</div>

		<div class="p-6 space-y-4">
			{#if title}
				<Dialog.Header>
					<Dialog.Title class="text-2xl font-bold">{title}</Dialog.Title>
				</Dialog.Header>
			{/if}
			
			<div>
				{@render children?.()}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
