<script lang="ts">
	import type { ProgramPageData } from '$lib/types/program';
	import BrandIcon from '$lib/components/icons/brand-icon.svelte';
	import { Blocks, Braces, CodeXml, Rocket } from '@lucide/svelte';

	let { journey }: { journey: ProgramPageData['journey'] } = $props();
</script>

<section class="overflow-hidden px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="mx-auto max-w-3xl text-center">
			<h2
				class="font-raleway text-4xl/12 md:text-6xl/16 leading-tight font-semibold text-black sm:text-4xl lg:text-5xl"
			>
				Peta Perjalanan Belajarmu <br> Bersama Nuwaira
			</h2>
		</div>

		<div class="relative mt-12">
			<div
				class="grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto pb-5 sm:auto-cols-[48%] lg:auto-cols-[31%] xl:auto-cols-[24%]"
			>
				{#each journey.stages as stage, index (stage.title)}
					<article class="relative snap-start">
						{#if index < journey.stages.length - 1}
							<span
								aria-hidden="true"
								class="absolute top-5 left-1/2 z-0 w-[calc(100%+1rem)] border-t-2 border-dashed border-[#8fb2ff]"
							></span>
						{/if}
						<div
							class="relative z-10 mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-[#2458cf] font-plus-jakarta text-sm font-bold text-white"
						>
							{index + 1}
						</div>
						<div class="h-[calc(100%-3.5rem)] rounded-3xl bg-[#f5f7fb] p-5">
							<div class="flex items-start justify-between gap-4">
								<div>
									<h3 class="font-raleway text-2xl font-semibold text-slate-950">{stage.title}</h3>
									<span
										class="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600"
									>
										{stage.weeks}
									</span>
								</div>
							</div>

							<p class="mt-4 text-base">{stage.description}</p>

							<div class="mt-5 flex flex-wrap gap-2">
								{#each stage.tools as tool (tool.iconKey)}
										<BrandIcon iconKey={tool.iconKey} class="size-12 p-2 bg-white rounded-xl" />
								{/each}
							</div>

							<div class="mt-6 border-t border-slate-200 pt-4">
								<p class="text-sm py-1 px-2 border w-fit rounded-full">Output</p>
								<p class="mt-2 text-base leading-5">{stage.output}</p>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>
