<script lang="ts">
	import BeasiswaIcon from '$lib/components/icons/beasiswaIcon.svelte';
	import GiftIcon from '$lib/components/icons/giftIcon.svelte';
	import MicrochipIcon from '$lib/components/icons/microchipIcon.svelte';
	import RegularIcon from '$lib/components/icons/regularIcon.svelte';
	import PrivateIcon from '$lib/components/icons/privateIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { ProgramPageData } from '$lib/types/program';
	import { CalendarRange, Check, Clock, GraduationCap, MapPin, Monitor } from '@lucide/svelte';

	let { pricing }: { pricing: ProgramPageData['pricing'] } = $props();

	const perks = [
		{
			icon: BeasiswaIcon,
			description: 'Dapatkan beasiswa senilai Rp500.000 untuk 10 siswa pertama'
		},
		{
			icon: MicrochipIcon,
			description: 'Selama program akan mendapatkan 1.000.000 AI Token per bulan'
		},
		{
			icon: GiftIcon,
			description: 'Setiap siswa akan mendapatkan Merchandise Eksklusif Nuwaira Academy'
		}
	];

	function formatDays(days: string[]) {
		if (days.length < 2) return days[0] ?? '';
		if (days.length === 2) return `${days[0]} & ${days[1]}`;
		return `${days.slice(0, -1).join(', ')}, & ${days.at(-1)}`;
	}
</script>

{#snippet renderPerkIcon(Icon: typeof BeasiswaIcon)}
	<Icon className="size-8 stroke-[1.5]" />
{/snippet}

<section class="bg-[#f2f6ff] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="text-center">
			<h2 class="font-raleway text-4xl/12 font-semibold text-black sm:text-4xl lg:text-5xl">
				Biaya dan Pendaftaran Program
			</h2>
		</div>

		<div class="mt-10 grid gap-5 lg:grid-cols-2">
			{#each pricing.plans as plan (plan.id)}
				<article class="flex h-full flex-col rounded-3xl bg-white p-6 sm:p-8">
					<!-- Header -->
					<div class="flex flex-wrap items-center justify-between gap-3">
						<div class="flex items-center gap-2 text-sm font-bold text-[#2458cf]">
							<div class="w-8 h-auto text-white bg-[#2458cf] p-2 rounded-full">
								{#if plan.badge != 'Private'}
									<RegularIcon className="w-full h-auto" />
								{:else}
									<PrivateIcon className="w-full h-auto" />
								{/if}
							</div>
							{plan.name}
						</div>
					</div>

					<!-- Title -->
					<h3 class="mt-5 max-w-xl font-raleway text-2xl font-semibold text-slate-950">
						{plan.title + ' - ' + plan.badge}
					</h3>

					<!-- Schedule info (batch type only) -->
					{#if plan.scheduleInfo}
						{@const info = plan.scheduleInfo}
						<div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
							<div class="flex flex-col gap-2 rounded-2xl border border-slate-300 py-2 px-4">
								{#if info.days.length > 0}
									<div class="flex items-center gap-2.5 text-base md:text-lg font-semibold">
										<span>{formatDays(info.days)}</span>
									</div>
								{/if}
								{#if info.time}
									<div class="flex items-center gap-2.5 text-sm text-slate-600">
										<span>{info.time}</span>
									</div>
								{/if}
							</div>
							<div class="flex flex-col gap-2 rounded-2xl border border-slate-300 py-2 px-4">
								{#if info.startPeriod || info.endPeriod}
									<div class="flex items-center gap-2.5 text-sm">
										<span class="text-base md:text-lg font-semibold">
											{info.startPeriod ?? '—'}
											{#if info.startPeriod && info.endPeriod}
												–
											{/if}
											{info.endPeriod ?? ''}
										</span>
									</div>
								{/if}
								{#if info.locationType === 'remote'}
									<div class="flex items-center gap-2.5 text-sm text-slate-600">
										<Monitor class="size-4 shrink-0 text-[#2458cf]" />
										<span>Remote</span>
									</div>
								{:else if info.location}
									<div class="flex items-center gap-2.5 text-sm text-slate-600">
										<span>Offline di {info.location}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Benefits -->
					{#if plan.benefits.length > 0}
						<ul class="mt-5 space-y-2.5">
							{#each plan.benefits as benefit (benefit)}
								<li class="flex items-start gap-2.5 text-sm text-slate-600">
									<span
										class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2458cf] text-white"
									>
										<Check class="size-3" stroke-width={3} />
									</span>
									<span>{benefit}</span>
								</li>
							{/each}
						</ul>
					{/if}

					<!-- Price + CTA -->
					<div class="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
						<div>
							<p class="text-xs text-slate-400">Biaya Program</p>
							<p class="mt-1 font-raleway text-2xl font-bold text-slate-950">{plan.price}</p>
						</div>
						<Button
							href={plan.ctaUrl}
							class="inline-flex h-11 items-center justify-center rounded-full bg-[#2458cf] px-6 text-sm font-semibold text-white transition hover:bg-brand"
						>
							{plan.ctaLabel}
						</Button>
					</div>
				</article>
			{/each}
		</div>

		<!-- Perks -->
		<div class="mt-5 grid gap-3 md:grid-cols-3">
			{#each perks as perk, i (i)}
				<div class="flex items-center gap-4 rounded-2xl bg-white p-4">
					<div class="text-black w-12 h-12">
						{@render renderPerkIcon(perk.icon)}
					</div>
					<div>
						<p class="mt-1 text-base leading-5 text-slate-500">{perk.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
