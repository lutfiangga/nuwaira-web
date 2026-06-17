<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { formatEventDateRange, formatEventTimeRange, formatPrice } from './format';
	import type { PublicEventSummary } from '$lib/types/event';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { event }: { event: PublicEventSummary } = $props();

	type EventInfoItem = { label: string; value: string };

	const eventInfoItems = $derived(
		[
			{ label: 'Tanggal', value: formatEventDateRange(event.startAt, event.endAt) },
			{ label: 'Jam', value: formatEventTimeRange(event.startAt, event.endAt) + " WIB" },
			{ label: 'Lokasi', value: event.location }
		].filter((item): item is EventInfoItem => Boolean(item.value))
	);
</script>

<a href={`/acara/${event.slug}`} 
	class="group flex flex-col overflow-hidden rounded-3xl border border-slate-300/30 hover:scale-105 cursor-pointer bg-white transition-all duration-300"
>
	<!-- Image -->
	<div class="h-full w-full">
		{#if event.imageUrl}
			<img
				src={event.imageUrl}
				alt={event.title}
				class="h-auto w-full object-cover ascpect-4/5 rounded-3xl"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center p-12">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-auto w-full ascpect-4/5 py-12 px-8" />
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col p-5">
		<!-- Badge -->
		{#if event.eventType}
			<Badge class="mb-4 bg-blue-100 text-blue-600 text-sm">{event.eventType}</Badge>
		{/if}
		<h2 class="font-raleway line-clamp-2 text-lg font-semibold text-slate-900">
			{event.title}
		</h2>
		<p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
			{event.description ?? ''}
		</p>

		<ul class="mt-4 space-y-1">
			{#each eventInfoItems as info (info.label)}
				<li class="flex items-center gap-2 text-sm text-[#47474B]">
					<span class="size-3 shrink-0 rounded-full bg-blue-800"></span>
					<span class="block line-clamp-1">{info.value}</span>
				</li>
			{/each}
		</ul>

		<hr class="my-4 border-slate-300" />

		<div class="flex items-center justify-between">
			<div class="flex flex-col gap-1">
				<p class="text-sm text-[#47474B] text-sm">Biaya {event.eventType}</p>
				<p class="text-lg md:text-2xl font-bold text-black font-raleway">
					{formatPrice(event.priceAmount)}
				</p>
		</div>
			<Button
				href="/acara/{event.slug}/register"
				variant="ghost"
				class="group/btn bg-blue-800 text-white rounded-full "
			>
				Daftar Sekarang
			</Button>
		</div>
	</div>
</a>
