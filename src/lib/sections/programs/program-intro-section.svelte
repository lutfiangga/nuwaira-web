<script lang="ts">
	import type { ProgramPageData } from '$lib/types/program';
	import { CircleCheck } from '@lucide/svelte';

	let { intro }: { intro: ProgramPageData['intro'] } = $props();
</script>

<section id="tentang-program" class="px-5 py-14 sm:px-8 lg:px-16 lg:py-24">
	<div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
		<div class="overflow-hidden rounded-[2rem]">
			<img
				src={intro.image}
				alt={intro.imageAlt}
				class="aspect-[4/5] h-full w-full object-cover"
				loading="lazy"
			/>
		</div>

		<div>
			<p class="text-xs font-bold tracking-[0.2em] text-[#356fe5] uppercase">{intro.eyebrow}</p>
			<h2
				class="mt-3 max-w-2xl font-raleway text-3xl leading-tight font-semibold text-black sm:text-4xl lg:text-5xl"
			>
				{intro.title}
			</h2>

			<div class="mt-5 space-y-4 font-plus-jakarta text-sm leading-7 text-slate-600 sm:text-base">
				{#each intro.deskripsi as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
			</div>

			<div class="mt-7 space-y-3">
				{#each intro.learningBackground as item (item)}
					<div class="flex items-center gap-3 rounded-xl bg-[#f5f7fb] px-4 py-3.5">
						<CircleCheck class="size-5 shrink-0 fill-[#356fe5] text-white" />
						<span class="font-plus-jakarta text-sm font-medium text-slate-800">{item}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
