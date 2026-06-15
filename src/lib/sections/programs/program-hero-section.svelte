<script lang="ts">
	import type { ProgramPageData } from '$lib/types/program';
	import {
		Clock3,
		MapPinned,
		UserRoundCheck,
		GraduationCap,
		BookOpen,
		Briefcase,
		Award,
		Users,
		Target,
		Trophy,
		Calendar,
		Zap,
		Star,
		TrendingUp,
		Rocket,
		Globe,
		Laptop,
		Code,
		Lightbulb
	} from '@lucide/svelte';

	const iconMap: Record<string, any> = {
		Clock3,
		MapPinned,
		UserRoundCheck,
		GraduationCap,
		BookOpen,
		Briefcase,
		Award,
		Users,
		Target,
		Trophy,
		Calendar,
		Zap,
		Star,
		TrendingUp,
		Rocket,
		Globe,
		Laptop,
		Code,
		Lightbulb
	};

	let { program }: { program: ProgramPageData } = $props();
</script>

{#snippet renderIcon(key: string, size: string)}
	{#if iconMap[key]}
		{@const Icon = iconMap[key]}
		<Icon class={size} />
	{:else}
		<Clock3 class={size} />
	{/if}
{/snippet}

<section class="px-5 pb-10 sm:px-8 lg:px-16 lg:pb-16">
	<div class="mx-auto max-w-7xl">
		<div class="grid items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-12">
			<div class="max-w-xl">
				<p class="mb-4 text-xs font-bold tracking-[0.22em] text-brand uppercase">
					{program.eyebrow}
				</p>
				<h1
					class="font-raleway text-4xl leading-[1.08] font-semibold tracking-tight text-black sm:text-5xl lg:text-7xl"
				>
					{program.title}
				</h1>
				<p class="mt-6 max-w-lg font-plus-jakarta text-sm leading-7 text-slate-600 sm:text-base">
					{program.summary}
				</p>
			</div>

			<div class="relative overflow-hidden rounded-[2rem] bg-slate-100">
				<img
					src={program.heroImage}
					alt={program.heroImageAlt}
					class="aspect-[4/3] h-full w-full object-cover"
					loading="eager"
					fetchpriority="high"
				/>
				<div
					class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
				></div>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-3">
			{#each program.metrics as metric (metric.label)}
				<div class="flex items-center gap-4 rounded-2xl bg-[#f5f7fb] px-5 py-4">
					<div class="order-2 ml-auto text-[#356fe5]">
						{@render renderIcon(metric.icon, 'size-9 stroke-[1.6]')}
					</div>
					<div>
						<p class="text-xs text-slate-500">{metric.label}</p>
						<p class="mt-1 font-raleway text-lg font-semibold text-slate-950">{metric.value}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
