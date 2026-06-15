<script lang="ts">
	import { CalendarDays, ArrowLeft, Info, Link2, Clock } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const event = $derived(data.event);

	function formatDate(d: Date | string | null | undefined) {
		if (!d) return '-';
		return new Date(d).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{event.title} | Admin Nuwaira</title>
</svelte:head>

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div class="flex items-center gap-4">
			<Button href="/events" variant="ghost" size="icon" class="size-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white">
				<ArrowLeft class="size-5" />
			</Button>
			<div>
				<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
					<Info class="size-5" /> Detail Acara
				</div>
				<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">{event.title}</h2>
			</div>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<h3 class="font-raleway flex items-center gap-3 text-lg font-semibold text-slate-900">
			<Info class="size-5 text-brand" />
			Informasi Acara
		</h3>
		<dl class="mt-5 grid gap-5 sm:grid-cols-2">
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Slug</dt>
				<dd class="mt-1 font-mono text-slate-800">{event.slug}</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</dt>
				<dd class="mt-1">
					<span class={['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', event.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700']}>
						{event.isActive ? 'Active' : 'Inactive'}
					</span>
				</dd>
			</div>
			<div class="sm:col-span-2">
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Summary</dt>
				<dd class="mt-2 leading-6 text-slate-800">{event.summary}</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
					<span class="inline-flex items-center gap-1"><CalendarDays class="size-3.5" /> Mulai</span>
				</dt>
				<dd class="mt-1 text-slate-800">{formatDate(event.startAt)}</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
					<span class="inline-flex items-center gap-1"><CalendarDays class="size-3.5" /> Selesai</span>
				</dt>
				<dd class="mt-1 text-slate-800">{formatDate(event.endAt)}</dd>
			</div>
			<div class="sm:col-span-2">
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
					<span class="inline-flex items-center gap-1"><Link2 class="size-3.5" /> Registration URL</span>
				</dt>
				<dd class="mt-1">
					{#if event.registrationUrl}
						<a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" class="text-brand underline underline-offset-2 hover:text-brand/80">
							{event.registrationUrl}
						</a>
					{:else}
						<span class="text-slate-400">-</span>
					{/if}
				</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Dibuat</dt>
				<dd class="mt-1 flex items-center gap-2 text-slate-800">
					<CalendarDays class="size-4 text-brand" />
					{formatDate(event.createdAt)}
				</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Diperbarui</dt>
				<dd class="mt-1 flex items-center gap-2 text-slate-800">
					<CalendarDays class="size-4 text-brand" />
					{formatDate(event.updatedAt)}
				</dd>
			</div>
		</dl>
	</section>
</div>
