<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import type { PublicProgramSummary } from '$lib/types/program';

	let { programs }: { programs: PublicProgramSummary[] } = $props();
</script>

<section id="program" class="w-full max-w-7xl px-6 justify-center mx-auto py-12">
	<p class="text-base text-brand text-center uppercase">Program Unggulan Berbasis AI</p>
	<h2 class="text-4xl/12 md:text-6xl/16 max-w-5xl font-semibold text-black text-center font-raleway px-6 mx-auto text-center">
		Program yang Dirancang Khusus Untuk Era AI dan Industri
	</h2>

	<div class="flex flex-col gap-4 py-6 md:py-12 w-full">
		{#each programs as program, index (program.slug)}
			<Card class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full border-0">
				<div class="p-6 space-y-8 order-2 {index % 2 === 1 ? 'md:order-2' : 'md:order-1'}">
					<h3 class="text-3xl md:text-5xl font-semibold text-black font-raleway">
						{program.title}
					</h3>
					<p class="text-base text-black">{program.summary}</p>
					<Button
						variant="ghost"
						href={`/programs/${program.slug}`}
						class="rounded-full bg-black text-white hover:bg-black/80 h-[52px] hover:scale-105 px-6 font-plus-jakarta font-thin hover:text-white"
						>Lihat Detail Program</Button
					>
				</div>
				<div
					class="w-full h-full m-auto p-6 order-1 {index % 2 === 1 ? 'md:order-1' : 'md:order-2'}"
				>
					<img
						src={program.heroImage}
						alt={program.heroImageAlt}
						class="w-full h-full object-cover rounded-3xl md:rounded-4xl"
					/>
				</div>
			</Card>
		{/each}
	</div>
</section>
