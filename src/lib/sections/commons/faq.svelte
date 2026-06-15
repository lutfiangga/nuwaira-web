<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	let { faqs }: { faqs: { id: string; question: string; answer: string }[] } = $props();
</script>

<section class="px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
	<div class="mx-auto max-w-3xl">
		<h2 class="text-center font-raleway text-4xl font-semibold text-black lg:text-5xl">FAQ</h2>

		<div class="mt-10 divide-y divide-slate-200 border-y border-slate-200">
			{#each faqs as item, index (item.id)}
				<details class="group py-5" open={index === 0}>
					<summary
						class="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold text-slate-900"
					>
						{item.question}
						<ChevronDown
							class="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
						/>
					</summary>
					<p class="max-w-2xl pt-3 pr-8 text-sm leading-6 text-slate-500">{item.answer}</p>
				</details>
			{/each}
		</div>
	</div>
</section>
