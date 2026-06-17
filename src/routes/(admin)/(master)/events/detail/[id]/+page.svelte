<script lang="ts">
	import { CalendarDays, ArrowLeft, Info, MapPin, Tag, DollarSign, Users } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const event = $derived(data.event);
	const registrations = $derived(data.registrations ?? []);
	const totalRegistrations = $derived(data.registrationTotal ?? 0);

	function formatDate(d: Date | string | null | undefined) {
		const date = d ? new Date(d) : null;
		const validDate = date && !Number.isNaN(date.getTime());
		return validDate
			? date.toLocaleString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: '-';
	}

	function formatPrice(amount: number | null) {
		if (amount === null || amount === 0) return 'Full Beasiswa';
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-700',
		confirmed: 'bg-emerald-100 text-emerald-700',
		cancelled: 'bg-red-100 text-red-700'
	};
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

	{#if event.imageUrl}
		<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
			<img src={event.imageUrl} alt={event.title} class="h-64 w-full object-cover" />
		</section>
	{/if}

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
			{#if event.eventType}
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						<span class="inline-flex items-center gap-1"><Tag class="size-3.5" /> Tipe</span>
					</dt>
					<dd class="mt-1">
						<span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
							{event.eventType}
						</span>
					</dd>
				</div>
			{/if}
			{#if event.description}
				<div class="sm:col-span-2">
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</dt>
					<dd class="mt-2 whitespace-pre-wrap leading-7 text-slate-700">{event.description}</dd>
				</div>
			{/if}
			{#if event.location}
				<div class="sm:col-span-2">
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						<span class="inline-flex items-center gap-1"><MapPin class="size-3.5" /> Lokasi</span>
					</dt>
					<dd class="mt-1 text-slate-800">{event.location}</dd>
				</div>
			{/if}
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
					<span class="inline-flex items-center gap-1"><DollarSign class="size-3.5" /> Harga</span>
				</dt>
				<dd class="mt-1 text-slate-800">{formatPrice(event.priceAmount)}</dd>
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

	<!-- Event Registrations -->
	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<div class="flex items-center justify-between">
			<h3 class="font-raleway flex items-center gap-3 text-lg font-semibold text-slate-900">
				<Users class="size-5 text-brand" />
				Pendaftaran Acara
			</h3>
			<span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-brand">
				{totalRegistrations} pendaftar
			</span>
		</div>

		{#if registrations.length === 0}
			<p class="mt-6 rounded-2xl bg-slate-50 py-8 text-center text-sm text-slate-400">
				Belum ada pendaftar untuk acara ini.
			</p>
		{:else}
			<div class="mt-5 overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
							<th class="pb-3 pr-4">Nama</th>
							<th class="pb-3 pr-4">Email</th>
							<th class="pb-3 pr-4">Telepon</th>
							<th class="pb-3 pr-4">Tipe</th>
							<th class="pb-3 pr-4">Status</th>
							<th class="pb-3">Tanggal</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-50">
						{#each registrations as reg (reg.id)}
							<tr class="text-slate-700">
								<td class="py-3 pr-4 font-medium">{reg.fullName}</td>
								<td class="py-3 pr-4">{reg.email}</td>
								<td class="py-3 pr-4">{reg.phone}</td>
								<td class="py-3 pr-4">
									<span class={['inline-flex rounded-full px-2 py-0.5 text-xs', reg.participantType === 'instansi' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600']}>
										{reg.participantType === 'instansi' ? 'Instansi' : 'Perorangan'}
									</span>
								</td>
								<td class="py-3 pr-4">
									<span class={['inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', statusColors[reg.status] ?? 'bg-slate-100 text-slate-600']}>
										{reg.status}
									</span>
								</td>
								<td class="py-3 text-xs text-slate-500">{formatDate(reg.createdAt)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
