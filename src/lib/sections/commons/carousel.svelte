<script lang="ts">
	export let images: readonly { src: string; alt: string }[] = [];
</script>

<section class="w-full overflow-hidden">
	<div class="carousel-track flex w-max">
		{#each [false, true] as duplicate}
			<div class="flex shrink-0 gap-2 pr-2 sm:gap-4 sm:pr-4" aria-hidden={duplicate}>
				{#each images as image, i (image.src)}
					<div class="shrink-0 overflow-hidden rounded-3xl">
						<img
							src={image.src}
							alt={duplicate ? '' : image.alt}
							loading={!duplicate && i < 2 ? 'eager' : 'lazy'}
							class="block h-auto w-auto max-h-[clamp(220px,52vw,520px)] max-w-none"
						/>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

<style>
	.carousel-track {
		animation: carousel-scroll 48s linear infinite;
		will-change: transform;
	}

	section:hover .carousel-track,
	section:focus-within .carousel-track {
		animation-play-state: paused;
	}

	@keyframes carousel-scroll {
		to {
			transform: translateX(-50%);
		}
	}
</style>
