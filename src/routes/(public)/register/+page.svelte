<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		Eye,
		EyeOff,
		Loader2,
		MapPin,
		ShieldCheck,
		UserRound,
		UsersRound
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';
	import FormDatePicker from '$lib/components/forms/form-date-picker.svelte';
	import Turnstile from '$lib/components/turnstile.svelte';
	import PlanIcon from '$lib/components/icons/planIcon.svelte';

	type LocationOption = {
		id: string;
		name: string;
	};

	type RegistrationForm = {
		message?: string;
		errors?: Record<string, string[] | undefined>;
		values?: Record<string, string>;
	};

	let {
		data,
		form
	}: {
		data: { provinces: LocationOption[] };
		form?: RegistrationForm;
	} = $props();

	const values = $derived(form?.values ?? {});
	const errors = $derived(form?.errors ?? {});
	const inputClass =
		'h-12 rounded-xl border-slate-200 bg-white px-4 shadow-none focus-visible:border-brand focus-visible:ring-brand/15';
	const textareaClass =
		'min-h-28 rounded-xl border-slate-200 bg-white px-4 py-3 shadow-none focus-visible:border-brand focus-visible:ring-brand/15';

	let birthDate = $state('');
	let provinceId = $state('');
	let regencyId = $state('');
	let districtId = $state('');
	let villageId = $state('');
	let religion = $state('');
	let guardianRelation = $state('');
	let referralSource = $state('');
	let regencies = $state<LocationOption[]>([]);
	let districts = $state<LocationOption[]>([]);
	let villages = $state<LocationOption[]>([]);
	let restoredForm = $state<RegistrationForm | undefined>();
	let loadingLevel = $state<'regencies' | 'districts' | 'villages' | null>(null);
	let locationError = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let turnstileToken = $state('');
	let agreedToTerms = $state(false);

	const religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
	const guardianRelations = ['Orang Tua', 'Saudara', 'Wali Asuh', 'Lainnya'];
	const referralSources = ['Teman', 'Keluarga', 'Instagram', 'TikTok', 'Google', 'Lainnya'];
	const maxBirthDate = new Date().toISOString().slice(0, 10);
	const provinceOptions = $derived(data.provinces.map(toComboboxItem));
	const regencyOptions = $derived(regencies.map(toComboboxItem));
	const districtOptions = $derived(districts.map(toComboboxItem));
	const villageOptions = $derived(villages.map(toComboboxItem));
	const religionOptions = religions.map((item) => ({ value: item, label: item }));
	const guardianRelationOptions = guardianRelations.map((item) => ({ value: item, label: item }));
	const referralSourceOptions = referralSources.map((item) => ({ value: item, label: item }));

	$effect(() => {
		if (form === restoredForm) return;

		restoredForm = form;
		birthDate = form?.values?.birthDate ?? '';
		provinceId = form?.values?.provinceId ?? '';
		regencyId = form?.values?.regencyId ?? '';
		districtId = form?.values?.districtId ?? '';
		villageId = form?.values?.villageId ?? '';
		religion = form?.values?.religion ?? '';
		guardianRelation = form?.values?.guardianRelation ?? '';
		referralSource = form?.values?.referralSource ?? '';
		agreedToTerms = form?.values?.agreedToTerms === 'true';
		void restoreLocations();
	});

	async function restoreLocations() {
		if (!provinceId) return;

		regencies = await fetchLocations('regencies', provinceId);
		if (!regencyId) return;

		districts = await fetchLocations('districts', regencyId);
		if (!districtId) return;

		villages = await fetchLocations('villages', districtId);
	}

	async function fetchLocations(level: 'regencies' | 'districts' | 'villages', parentId: string) {
		if (!parentId) return [];

		loadingLevel = level;
		locationError = '';

		try {
			const response = await fetch(
				`/api/locations?level=${level}&parentId=${encodeURIComponent(parentId)}`
			);

			if (!response.ok) throw new Error('Gagal memuat data lokasi');

			const result: unknown = await response.json();
			return Array.isArray(result) ? (result as LocationOption[]) : [];
		} catch (error) {
			console.error('Location request failed:', error);
			locationError = 'Data lokasi gagal dimuat. Silakan coba pilih kembali.';
			return [];
		} finally {
			loadingLevel = null;
		}
	}

	async function handleProvinceChange(selectedValue: string) {
		provinceId = selectedValue;
		regencyId = '';
		districtId = '';
		villageId = '';
		districts = [];
		villages = [];
		regencies = await fetchLocations('regencies', provinceId);
	}

	async function handleRegencyChange(selectedValue: string) {
		regencyId = selectedValue;
		districtId = '';
		villageId = '';
		villages = [];
		districts = await fetchLocations('districts', regencyId);
	}

	async function handleDistrictChange(selectedValue: string) {
		districtId = selectedValue;
		villageId = '';
		villages = await fetchLocations('villages', districtId);
	}

	function toComboboxItem(item: LocationOption) {
		return { value: item.id, label: item.name };
	}

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		window.location.href = resolve('/');
	}
</script>

<svelte:head>
	<title>Pendaftaran Siswa | Nuwaira Academy</title>
	<meta
		name="description"
		content="Form pendaftaran siswa Nuwaira Academy untuk program coding dan AI."
	/>
</svelte:head>

{#snippet fieldError(field: string)}
	{#if errors[field]?.[0]}
		<p class="text-sm text-red-600">{errors[field][0]}</p>
	{/if}
{/snippet}

<main
	class="min-h-screen bg-[radial-gradient(circle_at_top_left,#e7eeff_0,transparent_34%),linear-gradient(to_bottom,#f8faff,#f3f6fb)] px-4 py-6 text-slate-950 sm:px-6 lg:py-10"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10 flex items-center justify-between gap-4">
			<a href={resolve('/')} class="inline-flex items-center">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-9 w-auto" />
			</a>
			<Button
				type="button"
				variant="outline"
				class="h-11 rounded-full bg-brand px-5 text-white hover:bg-brand/80"
				onclick={goBack}
			>
				<ArrowLeft class="size-4" />
				Kembali
			</Button>
		</div>

		<header class="mb-10">
			<div
				class="text-brand inline-flex items-center gap-2 rounded-full text-base font-semibold uppercase tracking-[0.18em]"
			>
				Pendaftaran Siswa
			</div>
			<h1 class="font-raleway mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
				Mulai perjalanan belajarmu bersama Nuwaira
			</h1>
			<p class="mt-4 leading-7 text-slate-600">
				Isi data dengan benar sesuai identitas. Data ini digunakan untuk proses administrasi dan
				pendampingan selama program.
			</p>
		</header>

		<form method="post" class="space-y-7" novalidate>
			{#if form?.message}
				<div class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
					{form.message}
				</div>
			{/if}

			<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
				<legend class="px-2">
					<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
						<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
							<UserRound class="size-5" />
						</span>
						Data Diri
					</span>
				</legend>
				<p class="text-sm leading-6 text-slate-500">
					Data utama siswa sesuai identitas dan domisili saat ini.
				</p>

				<div class="mt-6 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-semibold text-slate-700">
							Nama lengkap sesuai identitas (KTP)<span class="text-red-500">*</span>
						</span>
						<Input
							name="fullName"
							required
							autocomplete="name"
							placeholder="Nama lengkap"
							value={values.fullName ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.fullName?.[0])}
						/>
						{@render fieldError('fullName')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							NIK<span class="text-red-500">*</span>
						</span>
						<Input
							name="nik"
							required
							inputmode="numeric"
							pattern="[0-9]{16}"
							maxlength={16}
							placeholder="16 digit NIK"
							value={values.nik ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.nik?.[0])}
						/>
						{@render fieldError('nik')}
					</label>

					<FormDatePicker
						name="birthDate"
						label="Tanggal lahir"
						bind:value={birthDate}
						required
						min="1940-01-01"
						max={maxBirthDate}
						error={errors.birthDate?.[0]}
					/>

					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							WhatsApp<span class="text-red-500">*</span>
						</span>
						<Input
							name="whatsapp"
							required
							inputmode="tel"
							autocomplete="tel"
							placeholder="08xxxxxxxxxx"
							value={values.whatsapp ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.whatsapp?.[0])}
						/>
						{@render fieldError('whatsapp')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							Email<span class="text-red-500">*</span>
						</span>
						<Input
							name="email"
							required
							type="email"
							autocomplete="email"
							placeholder="nama@email.com"
							value={values.email ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.email?.[0])}
						/>
						{@render fieldError('email')}
					</label>

					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-semibold text-slate-700">
							Alamat lengkap<span class="text-red-500">*</span>
						</span>
						<Textarea
							name="fullAddress"
							required
							rows={4}
							placeholder="Dusun, RT/RW, jalan, nomor rumah, dan detail alamat lainnya"
							value={values.fullAddress ?? ''}
							class={textareaClass}
							aria-invalid={Boolean(errors.fullAddress?.[0])}
						/>
						{@render fieldError('fullAddress')}
					</label>
				</div>

				<div class="my-7 flex items-center gap-3 border-y border-slate-100 py-4">
					<span class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-brand">
						<MapPin class="size-5" />
					</span>
					<div>
						<h2 class="font-semibold text-slate-800">Domisili</h2>
						<p class="text-xs text-slate-500">Cari dan pilih wilayah secara berurutan.</p>
					</div>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<FormCombobox
						name="provinceId"
						label="Provinsi"
						items={provinceOptions}
						bind:value={provinceId}
						required
						placeholder="Pilih provinsi"
						searchPlaceholder="Cari provinsi..."
						error={errors.provinceId?.[0]}
						onSelect={handleProvinceChange}
					/>
					<FormCombobox
						name="regencyId"
						label="Kabupaten/kota"
						items={regencyOptions}
						bind:value={regencyId}
						required
						placeholder="Pilih kabupaten/kota"
						searchPlaceholder="Cari kabupaten/kota..."
						error={errors.regencyId?.[0]}
						disabled={!provinceId}
						loading={loadingLevel === 'regencies'}
						onSelect={handleRegencyChange}
					/>
					<FormCombobox
						name="districtId"
						label="Kecamatan"
						items={districtOptions}
						bind:value={districtId}
						required
						placeholder="Pilih kecamatan"
						searchPlaceholder="Cari kecamatan..."
						error={errors.districtId?.[0]}
						disabled={!regencyId}
						loading={loadingLevel === 'districts'}
						onSelect={handleDistrictChange}
					/>
					<FormCombobox
						name="villageId"
						label="Kelurahan/desa"
						items={villageOptions}
						bind:value={villageId}
						required
						placeholder="Pilih kelurahan/desa"
						searchPlaceholder="Cari kelurahan/desa..."
						error={errors.villageId?.[0]}
						disabled={!districtId}
						loading={loadingLevel === 'villages'}
					/>

					{#if locationError}
						<p class="text-sm text-red-600 sm:col-span-2">{locationError}</p>
					{/if}

					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							Pendidikan aktif<span class="text-red-500">*</span>
						</span>
						<Input
							name="activeEducation"
							required
							placeholder="Contoh: SMA kelas 12, S1 Informatika"
							value={values.activeEducation ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.activeEducation?.[0])}
						/>
						{@render fieldError('activeEducation')}
					</label>
					<FormCombobox
						name="religion"
						label="Agama"
						items={religionOptions}
						bind:value={religion}
						required
						placeholder="Pilih agama"
						searchPlaceholder="Cari agama..."
						error={errors.religion?.[0]}
					/>
					{#if religion === 'Lainnya'}
						<label class="grid gap-2 sm:col-span-2">
							<span class="text-sm font-semibold text-slate-700">
								Tuliskan agama<span class="text-red-500">*</span>
							</span>
							<Input
								name="religionOther"
								required
								placeholder="Tuliskan agama"
								value={values.religionOther ?? ''}
								class={inputClass}
								aria-invalid={Boolean(errors.religionOther?.[0])}
							/>
							{@render fieldError('religionOther')}
						</label>
					{/if}
				</div>
			</fieldset>

			<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
				<legend class="px-2">
					<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
						<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
							<UsersRound class="size-5" />
						</span>
						Data Wali
					</span>
				</legend>
				<p class="mt-3 text-sm leading-6 text-slate-500">
					Kontak wali yang dapat dihubungi selama proses belajar.
				</p>

				<div class="mt-6 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-semibold text-slate-700">
							Nama wali<span class="text-red-500">*</span>
						</span>
						<Input
							name="guardianName"
							required
							placeholder="Nama lengkap wali"
							value={values.guardianName ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.guardianName?.[0])}
						/>
						{@render fieldError('guardianName')}
					</label>
					<FormCombobox
						name="guardianRelation"
						label="Hubungan dengan wali"
						items={guardianRelationOptions}
						bind:value={guardianRelation}
						required
						placeholder="Pilih hubungan"
						searchPlaceholder="Cari hubungan..."
						error={errors.guardianRelation?.[0]}
					/>
					{#if guardianRelation === 'Lainnya'}
						<label class="grid gap-2">
							<span class="text-sm font-semibold text-slate-700">
								Tuliskan hubungan<span class="text-red-500">*</span>
							</span>
							<Input
								name="guardianRelationOther"
								required
								placeholder="Contoh: Paman, Bibi"
								value={values.guardianRelationOther ?? ''}
								class={inputClass}
								aria-invalid={Boolean(errors.guardianRelationOther?.[0])}
							/>
							{@render fieldError('guardianRelationOther')}
						</label>
					{/if}
					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							WhatsApp wali<span class="text-red-500">*</span>
						</span>
						<Input
							name="guardianWhatsapp"
							required
							inputmode="tel"
							placeholder="08xxxxxxxxxx"
							value={values.guardianWhatsapp ?? ''}
							class={inputClass}
							aria-invalid={Boolean(errors.guardianWhatsapp?.[0])}
						/>
						{@render fieldError('guardianWhatsapp')}
					</label>
				</div>
			</fieldset>

			<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
				<legend class="px-2">
					<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
						<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
							<PlanIcon className="size-5" />
						</span>
						Data Lainnya
					</span>
				</legend>

				<div class="mt-6 grid gap-5">
					<FormCombobox
						name="referralSource"
						label="Dari mana mengetahui program ini?"
						items={referralSourceOptions}
						bind:value={referralSource}
						required
						placeholder="Pilih sumber informasi"
						searchPlaceholder="Cari sumber..."
						error={errors.referralSource?.[0]}
					/>
					{#if referralSource === 'Lainnya'}
						<label class="grid gap-2">
							<span class="text-sm font-semibold text-slate-700">
								Tuliskan sumber informasi<span class="text-red-500">*</span>
							</span>
							<Input
								name="referralSourceOther"
								required
								placeholder="Contoh: Sekolah, komunitas, acara"
								value={values.referralSourceOther ?? ''}
								class={inputClass}
								aria-invalid={Boolean(errors.referralSourceOther?.[0])}
							/>
							{@render fieldError('referralSourceOther')}
						</label>
					{/if}
					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							Tujuan mengikuti program ini<span class="text-red-500">*</span>
						</span>
						<Textarea
							name="programGoal"
							required
							rows={4}
							placeholder="Ceritakan target dan tujuan belajarmu"
							value={values.programGoal ?? ''}
							class={textareaClass}
							aria-invalid={Boolean(errors.programGoal?.[0])}
						/>
						{@render fieldError('programGoal')}
					</label>

					<div class="grid gap-5 sm:grid-cols-2">
						<fieldset class="rounded-2xl border border-slate-200 p-5">
							<legend class="px-1 text-sm font-semibold text-slate-700">
								Sudah memiliki basic programming?
							</legend>
							<div class="mt-4 grid grid-cols-2 gap-3">
								{#each [{ value: 'yes', label: 'Ya' }, { value: 'no', label: 'Tidak' }] as option (option.value)}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand/40"
									>
										<input
											type="radio"
											name="hasProgrammingBasics"
											value={option.value}
											required
											checked={values.hasProgrammingBasics === option.value}
											class="accent-brand size-4"
										/>
										<span class="text-sm font-medium">{option.label}</span>
									</label>
								{/each}
							</div>
							{@render fieldError('hasProgrammingBasics')}
						</fieldset>

						<fieldset class="rounded-2xl border border-slate-200 p-5">
							<legend class="px-1 text-sm font-semibold text-slate-700">
								Sudah menggunakan tools AI sehari-hari?
							</legend>
							<div class="mt-4 grid grid-cols-2 gap-3">
								{#each [{ value: 'yes', label: 'Ya' }, { value: 'no', label: 'Tidak' }] as option (option.value)}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand/40"
									>
										<input
											type="radio"
											name="usesAiTools"
											value={option.value}
											required
											checked={values.usesAiTools === option.value}
											class="accent-brand size-4"
										/>
										<span class="text-sm font-medium">{option.label}</span>
									</label>
								{/each}
							</div>
							{@render fieldError('usesAiTools')}
						</fieldset>
					</div>
				</div>
			</fieldset>

			<fieldset class="rounded-[28px] border border-white bg-white/90 p-5 backdrop-blur sm:p-8">
				<legend class="px-2">
					<span class="font-raleway flex items-center gap-3 text-2xl font-semibold">
						<span class="bg-brand flex size-10 items-center justify-center rounded-xl text-white">
							<ShieldCheck class="size-5" />
						</span>
						Keamanan Akun
					</span>
				</legend>
				<p class="mt-3 text-sm leading-6 text-slate-500">
					Gunakan password minimal delapan karakter dan jangan dibagikan kepada siapa pun.
				</p>

				<div class="mt-6 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							Password<span class="text-red-500">*</span>
						</span>
						<div class="relative">
							<Input
								name="password"
								required
								type={showPassword ? 'text' : 'password'}
								autocomplete="new-password"
								minlength={8}
								class={`${inputClass} pr-12`}
								aria-invalid={Boolean(errors.password?.[0])}
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
								aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
								onclick={() => (showPassword = !showPassword)}
							>
								{#if showPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
							</button>
						</div>
						{@render fieldError('password')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-semibold text-slate-700">
							Konfirmasi password<span class="text-red-500">*</span>
						</span>
						<div class="relative">
							<Input
								name="confirmPassword"
								required
								type={showConfirmPassword ? 'text' : 'password'}
								autocomplete="new-password"
								minlength={8}
								class={`${inputClass} pr-12`}
								aria-invalid={Boolean(errors.confirmPassword?.[0])}
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
								aria-label={showConfirmPassword
									? 'Sembunyikan konfirmasi password'
									: 'Tampilkan konfirmasi password'}
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
							>
								{#if showConfirmPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
							</button>
						</div>
						{@render fieldError('confirmPassword')}
					</label>
				</div>
			</fieldset>

			<div
				class="flex flex-col items-center gap-5 rounded-[28px] border border-white bg-white/90 p-6 sm:p-8"
			>
				<div
					class="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
				>
					<Checkbox
						id="agreedToTerms"
						bind:checked={agreedToTerms}
						aria-invalid={Boolean(errors.agreedToTerms?.[0])}
						class="mt-0.5 size-5"
					/>
					<input type="hidden" name="agreedToTerms" value={agreedToTerms ? 'true' : 'false'} />
					<label for="agreedToTerms" class="cursor-pointer text-sm leading-6 text-slate-600">
						Saya menyatakan seluruh data yang diisi sudah benar dan menyetujui data tersebut
						digunakan untuk proses pendaftaran program Nuwaira.
					</label>
				</div>
				{@render fieldError('agreedToTerms')}

				<Turnstile bind:token={turnstileToken} />
				<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

				<div class="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
					<Button
						type="submit"
						size="lg"
						disabled={Boolean(loadingLevel)}
						class="bg-brand h-12 rounded-full px-10 text-white hover:bg-brand/90"
					>
						{#if loadingLevel}<Loader2 class="size-4 animate-spin" />{/if}
						Kirim Pendaftaran
					</Button>
				</div>
				<p class="max-w-xl text-center text-sm leading-6 text-slate-500">
					Dengan mengirim form, kamu menyatakan data yang diberikan sudah benar.
				</p>
			</div>
		</form>
	</div>
</main>
