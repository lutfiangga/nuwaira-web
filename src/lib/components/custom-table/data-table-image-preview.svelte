<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, X } from '@lucide/svelte';

	let {
		open = $bindable(false),
		images = [],
		initialIndex = 0
	}: {
		open: boolean;
		images: string[];
		initialIndex?: number;
	} = $props();

	let currentIndex = $state(initialIndex);

	// Reset index when dialog opens
	$effect(() => {
		if (open) {
			currentIndex = initialIndex;
		}
	});

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white">
		<div class="relative w-full h-[80vh] flex items-center justify-center">
			<Dialog.Close
				class="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 focus:outline-none"
			>
				<X class="w-6 h-6 text-white" />
				<span class="sr-only">Close</span>
			</Dialog.Close>

			{#if images.length > 0}
				<img
					src={images[currentIndex]}
					alt={`Preview ${currentIndex + 1}`}
					class="max-w-full max-h-full object-contain"
				/>

				{#if images.length > 1}
					<Button
						variant="ghost"
						size="icon"
						class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-white"
						onclick={prev}
					>
						<ChevronLeft class="w-8 h-8" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-white"
						onclick={next}
					>
						<ChevronRight class="w-8 h-8" />
					</Button>

					<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium">
						{currentIndex + 1} / {images.length}
					</div>
				{/if}
			{:else}
				<div class="text-muted-foreground">No image available</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
