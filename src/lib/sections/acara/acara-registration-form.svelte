<script lang="ts">
	import { Tag, UserRound, Building2, ShieldCheck } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';
	import Turnstile from '$lib/components/turnstile.svelte';
	import { formatEventDateRange, formatEventTimeRange, formatPrice } from './format';

	type EventForRegistration = {
		slug: string;
		title: string;
		description: string | null;
		eventType: string | null;
		startAt: Date | null;
		endAt: Date | null;
		location: string | null;
		priceAmount: number | null;
	};

	type RegistrationForm = {
		message?: string;
		errors?: Record<string, string[] | undefined>;
		values?: Record<string, string>;
	};

	let {
		event,
		form
	}: {
		event: EventForRegistration;
		form?: RegistrationForm;
	} = $props();

	const values = $derived(form?.values ?? {});
	const errors = $derived(form?.errors ?? {});
	const inputClass = 'h-12 rounded-xl border-slate-200 bg-white px-4 shadow-none focus-visible:border-brand focus-visible:ring-brand/15';
	type EventInfoItem = { label: string; value: string };

	const eventInfoItems = $derived(
		[
			{ label: 'Tanggal', value: formatEventDateRange(event.startAt, event.endAt) },
			{ label: 'Jam', value: formatEventTimeRange(event.startAt, event.endAt) },
			{ label: 'Lokasi', value: event.location }
		].filter((item): item is EventInfoItem => Boolean(item.value))
	);

	let participantType = $state<'perorangan' | 'instansi'>(values.participantType as 'perorangan' | 'instansi' ?? 'perorangan');
	let referralSource = $state(values.referralSource ?? '');
	let interestedInCodingAi = $state(values.interestedInCodingAi === 'true');
	let agreedToTerms = $state(values.agreedToTerms === 'true');
	let turnstileToken = $state('');
	let restoredForm = $state<RegistrationForm | undefined>();

	const referralSources = ['Teman', 'Keluarga', 'Instagram', 'TikTok', 'Google', 'Lainnya'];
	const referralSourceOptions = referralSources.map((item) => ({ value: item, label: item }));

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		participantType = (form?.values?.participantType as 'perorangan' | 'instansi') ?? 'perorangan';
		referralSource = form?.values?.referralSource ?? '';
		interestedInCodingAi = form?.values?.interestedInCodingAi === 'true';
		agreedToTerms = form?.values?.agreedToTerms === 'true';
	});
</script>

{#snippet fieldError(field: string)}
	{#if errors[field]?.[0]}
		<p class="text-sm text-red-600">{errors[field][0]}</p>
	{/if}
{/snippet}

<header class="mb-10">
	<p class="text-brand inline-flex items-center gap-2 rounded-full text-base font-semibold uppercase tracking-[0.18em]">
		Pendaftaran Acara
	</p>
	<h1 class="font-raleway mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
		{event.title}
	</h1>
	{#if event.description}
		<p class="mt-3 leading-7 text-slate-600">{event.description}</p>
	{/if}

	<ul class="mt-5 grid gap-2 sm:grid-cols-3">
		{#each eventInfoItems as info (info.label)}
			<li class="flex items-start gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600">
				<span class="mt-2 size-2 shrink-0 rounded-full bg-brand"></span>
				<span class="min-w-0">
					<span class="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
						{info.label}
					</span>
					<span class="block line-clamp-1 font-medium text-slate-700">{info.value}</span>
				</span>
			</li>
		{/each}
	</ul>

	<div class="mt-5 flex flex-wrap gap-3">
		{#if event.eventType}
			<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-brand">
				<Tag class="size-3.5" />{event.eventType}
			</span>
		{/if}
		<span class="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
			{formatPrice(event.priceAmount)}
		</span>
	</div>
</header>

<form method="post" class="space-y-7" novalidate>
	{#if form?.message}
		<div class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
			{form.message}
		</div>
	{/if}

	<!-- Data Diri -->
	<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
		<legend class="px-2">
			<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
				<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
					<UserRound class="size-5" />
				</span>
				Data Diri
			</span>
		</legend>

		<div class="mt-6 grid gap-5 sm:grid-cols-2">
			<label class="grid gap-2 sm:col-span-2">
				<span class="text-sm font-semibold text-slate-700">Nama lengkap<span class="text-red-500">*</span></span>
				<Input name="fullName" required autocomplete="name" placeholder="Nama lengkap" value={values.fullName ?? ''} class={inputClass} aria-invalid={Boolean(errors.fullName?.[0])} />
				{@render fieldError('fullName')}
			</label>

			<label class="grid gap-2">
				<span class="text-sm font-semibold text-slate-700">Email<span class="text-red-500">*</span></span>
				<Input name="email" required type="email" autocomplete="email" placeholder="nama@email.com" value={values.email ?? ''} class={inputClass} aria-invalid={Boolean(errors.email?.[0])} />
				{@render fieldError('email')}
			</label>

			<label class="grid gap-2">
				<span class="text-sm font-semibold text-slate-700">Nomor telepon<span class="text-red-500">*</span></span>
				<Input name="phone" required inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" value={values.phone ?? ''} class={inputClass} aria-invalid={Boolean(errors.phone?.[0])} />
				{@render fieldError('phone')}
			</label>

			<label class="grid gap-2 sm:col-span-2">
				<span class="text-sm font-semibold text-slate-700">Domisili<span class="text-red-500">*</span></span>
				<Input name="domicile" required placeholder="Kota/Kabupaten domisili" value={values.domicile ?? ''} class={inputClass} aria-invalid={Boolean(errors.domicile?.[0])} />
				{@render fieldError('domicile')}
			</label>
		</div>
	</fieldset>

	<!-- Tipe Peserta -->
	<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
		<legend class="px-2">
			<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
				<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
					<Building2 class="size-5" />
				</span>
				Tipe Peserta
			</span>
		</legend>

		<div class="mt-5 grid gap-3 sm:grid-cols-2">
			<input type="hidden" name="participantType" value={participantType} />
			<label class="cursor-pointer rounded-2xl border p-4 transition {participantType === 'perorangan' ? 'border-brand bg-blue-50' : 'border-slate-200'}">
				<input type="radio" class="mr-2 accent-brand" value="perorangan" bind:group={participantType} />
				<span class="font-semibold">Perorangan</span>
				<p class="mt-1 text-xs text-slate-500">Pendaftaran sebagai individu.</p>
			</label>
			<label class="cursor-pointer rounded-2xl border p-4 transition {participantType === 'instansi' ? 'border-brand bg-blue-50' : 'border-slate-200'}">
				<input type="radio" class="mr-2 accent-brand" value="instansi" bind:group={participantType} />
				<span class="font-semibold">Instansi</span>
				<p class="mt-1 text-xs text-slate-500">Pendaftaran atas nama instansi/organisasi.</p>
			</label>
		</div>
		{@render fieldError('participantType')}

		{#if participantType === 'instansi'}
			<label class="mt-5 grid gap-2">
				<span class="text-sm font-semibold text-slate-700">Nama instansi / organisasi<span class="text-red-500">*</span></span>
				<Input name="organizationName" required placeholder="Nama instansi atau organisasi" value={values.organizationName ?? ''} class={inputClass} aria-invalid={Boolean(errors.organizationName?.[0])} />
				{@render fieldError('organizationName')}
			</label>
		{/if}
	</fieldset>

	<!-- Data Lainnya -->
	<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
		<legend class="px-2">
			<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
				<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
					<ShieldCheck class="size-5" />
				</span>
				Data Lainnya
			</span>
		</legend>

		<div class="mt-6 grid gap-5">
			<FormCombobox
				name="referralSource"
				label="Dari mana mengetahui acara ini?"
				items={referralSourceOptions}
				bind:value={referralSource}
				required
				placeholder="Pilih sumber informasi"
				searchPlaceholder="Cari sumber..."
				error={errors.referralSource?.[0]}
			/>
			{#if referralSource === 'Lainnya'}
				<label class="grid gap-2">
					<span class="text-sm font-semibold text-slate-700">Tuliskan sumber informasi<span class="text-red-500">*</span></span>
					<Input name="referralSourceOther" required placeholder="Contoh: Sekolah, komunitas, acara" value={values.referralSourceOther ?? ''} class={inputClass} aria-invalid={Boolean(errors.referralSourceOther?.[0])} />
					{@render fieldError('referralSourceOther')}
				</label>
			{/if}

			<div class="rounded-2xl border border-slate-200 p-5">
				<p class="text-sm font-semibold text-slate-700">Apakah tertarik belajar coding / AI?<span class="text-red-500">*</span></p>
				<div class="mt-3 grid grid-cols-2 gap-3">
					<input type="hidden" name="interestedInCodingAi" value={interestedInCodingAi ? 'true' : 'false'} />
					<label class="cursor-pointer rounded-2xl border p-4 transition {interestedInCodingAi ? 'border-brand bg-blue-50' : 'border-slate-200'}">
						<input type="radio" class="mr-2 accent-brand" checked={interestedInCodingAi} onchange={() => interestedInCodingAi = true} />
						<span class="font-semibold text-sm">Ya</span>
					</label>
					<label class="cursor-pointer rounded-2xl border p-4 transition {!interestedInCodingAi ? 'border-brand bg-blue-50' : 'border-slate-200'}">
						<input type="radio" class="mr-2 accent-brand" checked={!interestedInCodingAi} onchange={() => interestedInCodingAi = false} />
						<span class="font-semibold text-sm">Tidak</span>
					</label>
				</div>
			</div>
		</div>
	</fieldset>

	<!-- Submit -->
	<div class="flex flex-col items-center gap-5 rounded-[28px] border border-white bg-white/90 p-6 sm:p-8">
		<div class="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
			<Checkbox
				id="agreedToTerms"
				bind:checked={agreedToTerms}
				aria-invalid={Boolean(errors.agreedToTerms?.[0])}
				class="mt-0.5 size-5"
			/>
			<input type="hidden" name="agreedToTerms" value={agreedToTerms ? 'true' : 'false'} />
			<label for="agreedToTerms" class="cursor-pointer text-sm leading-6 text-slate-600">
				Saya menyatakan seluruh data yang diisi sudah benar dan menyetujui syarat serta ketentuan pendaftaran acara Nuwaira.
			</label>
		</div>
		{@render fieldError('agreedToTerms')}

		<Turnstile bind:token={turnstileToken} />
		<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

		<Button
			type="submit"
			size="lg"
			class="bg-brand h-12 rounded-full px-10 text-white hover:bg-brand/90"
		>
			Kirim Pendaftaran
		</Button>
		<p class="max-w-xl text-center text-sm leading-6 text-slate-500">
			Dengan mengirim form, kamu menyatakan data yang diberikan sudah benar.
		</p>
	</div>
</form>
