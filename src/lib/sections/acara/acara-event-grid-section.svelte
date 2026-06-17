<script lang="ts">
	import { CalendarDays } from '@lucide/svelte';
	import AcarCard from './acara-card.svelte';
	import type { PublicEventSummary } from '$lib/types/event';

	let { events }: { events: PublicEventSummary[] } = $props();
</script>

	<section class="mx-auto max-w-7xl space-y-4 ">
		<h2 class="font-raleway text-4xl/12 md:text-6xl/16 font-semibold text-black text-center max-w-3xl mx-auto mb-12">Jadwal <span class="text-brand">Workshop</span> Terdekat di Nuwaira Academy</h2>

		{#if events.length === 0}
			<div class="flex flex-col items-center justify-center rounded-[32px] bg-white/80 py-20 text-center">
				<div class="flex size-16 items-center justify-center rounded-2xl bg-blue-50">
					<CalendarDays class="size-8 text-brand" />
				</div>
				<h2 class="font-raleway mt-6 text-xl font-semibold text-slate-800">Belum ada acara</h2>
				<p class="mt-2 max-w-sm text-sm text-slate-500">
					Saat ini belum ada acara yang tersedia. Pantau terus halaman ini untuk info terbaru.
				</p>
			</div>
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each events as event (event.id)}
					<AcarCard {event} />
				{/each}
			</div>
		{/if}
	</section>
