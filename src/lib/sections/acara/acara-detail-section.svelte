<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowLeft,
		Tag,
		Users,
		ArrowRight,
		Clock,
		MapPin,
		Calendar
	} from '@lucide/svelte';
	import { formatEventDateRange, formatEventTimeRange, formatPrice } from './format';
	import type { PublicEventDetail } from '$lib/types/event';

	let { event }: { event: PublicEventDetail } = $props();

	type EventInfoItem = { icon: any; label: string; value: string };

	const eventInfoItems = $derived(
		[
			{ icon: Calendar, label: 'Tanggal', value: formatEventDateRange(event.startAt, event.endAt)},
			{ icon: Clock, label: 'Jam', value: formatEventTimeRange(event.startAt, event.endAt) + " WIB" },
			{ icon: MapPin, label: 'Lokasi', value: event.location },
			{ icon: Users, label: 'Biaya', value: formatPrice(event.priceAmount) }
		].filter((item): item is EventInfoItem => Boolean(item.value))
	);

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}
		window.location.href = resolve('/acara');
	}
</script>

<div class="mx-auto max-w-7xl px-6 my-16">
	<!-- Back Button -->
	<Button
		type="button"
		variant="outline"
		class="mb-8 h-11 rounded-full bg-white px-5 text-slate-700 hover:bg-slate-50"
		onclick={goBack}
	>
		<ArrowLeft class="size-4" />
		Kembali
	</Button>

	<!-- Hero Banner -->
	{#if event.imageUrl}
		<div class="overflow-hidden rounded-[32px] shadow-lg">
			<img
				src={event.imageUrl}
				alt={event.title}
				class="h-auto w-full aspect-4/5 object-cover"
			/>
		</div>
	{/if}

	<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
		<!-- Main Content -->
		<div>
			<div class="flex flex-wrap items-center gap-3">
				{#if event.eventType}
					<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1.5 text-sm font-semibold text-brand">
						<Tag class="size-3.5" />
						{event.eventType}
					</span>
				{/if}
				<span class={['inline-flex rounded-full px-3.5 py-1.5 text-sm font-bold', (event.priceAmount === null || event.priceAmount === 0) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']}>
					{formatPrice(event.priceAmount)}
				</span>
			</div>

			<h1 class="font-raleway mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
				{event.title}
			</h1>

			{#if event.description}
				<div class="mt-8">
					<h2 class="font-raleway text-xl font-semibold text-slate-900">Tentang Acara</h2>
					<div class="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
						{event.description}
					</div>
				</div>
			{/if}
		</div>

		<!-- Sidebar Info -->
		<aside class="flex flex-col gap-4">
			<div class="rounded-3xl border border-slate-300/30 p-6">
				<h3 class="font-raleway text-lg font-semibold text-slate-900">Informasi Acara</h3>

				<div class="mt-5 flex flex-col gap-4">
					<ul class="space-y-4">
						{#each eventInfoItems as info (info.label)}
							<li class="flex items-center gap-3">
								<info.icon class="text-brand size-5" />
								<span>
									<span class="block text-xs text-slate-400">
										{info.label}
									</span>
									<span class="mt-0.5 block text-base font-raleway font-semibold text-black">{info.value}</span>
								</span>
							</li>
						{/each}
					</ul>

				</div>

				<Button
					href="/acara/{event.slug}/register"
					class="mt-6 h-12 w-full rounded-full bg-brand text-white hover:bg-brand/90"
					size="lg"
				>
					Daftar Sekarang
					<ArrowRight class="size-4" />
				</Button>
			</div>
		</aside>
	</div>
</div>
