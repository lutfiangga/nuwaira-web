<script lang="ts">
	import { Eye, EyeOff, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Turnstile from '$lib/components/turnstile.svelte';

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
	const selectClass =
		'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50';

	let provinceId = $state('');
	let regencyId = $state('');
	let districtId = $state('');
	let villageId = $state('');
	let regencies = $state<LocationOption[]>([]);
	let districts = $state<LocationOption[]>([]);
	let villages = $state<LocationOption[]>([]);
	let restoredForm = $state<RegistrationForm | undefined>();
	let loadingLevel = $state<'regencies' | 'districts' | 'villages' | null>(null);
	let locationError = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let turnstileToken = $state('');

	const religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
	const guardianRelations = ['Orang Tua', 'Saudara', 'Wali Asuh', 'Lainnya'];
	const referralSources = ['Teman', 'Keluarga', 'Instagram', 'TikTok', 'Google', 'Lainnya'];
	const maxBirthDate = new Date().toISOString().slice(0, 10);

	$effect(() => {
		if (form === restoredForm) return;

		restoredForm = form;
		provinceId = form?.values?.provinceId ?? '';
		regencyId = form?.values?.regencyId ?? '';
		districtId = form?.values?.districtId ?? '';
		villageId = form?.values?.villageId ?? '';
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

	async function handleProvinceChange(event: Event) {
		provinceId = (event.currentTarget as HTMLSelectElement).value;
		regencyId = '';
		districtId = '';
		villageId = '';
		districts = [];
		villages = [];
		regencies = await fetchLocations('regencies', provinceId);
	}

	async function handleRegencyChange(event: Event) {
		regencyId = (event.currentTarget as HTMLSelectElement).value;
		districtId = '';
		villageId = '';
		villages = [];
		districts = await fetchLocations('districts', regencyId);
	}

	async function handleDistrictChange(event: Event) {
		districtId = (event.currentTarget as HTMLSelectElement).value;
		villageId = '';
		villages = await fetchLocations('villages', districtId);
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

<main class="min-h-screen bg-[#F5F7FB] px-4 py-8 text-slate-950 sm:px-6 lg:py-12">
	<div class="mx-auto w-full max-w-5xl">
		<a href="/" class="mb-8 inline-flex items-center">
			<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-9 w-auto" />
		</a>

		<div class="mb-8 max-w-3xl">
			<p class="text-brand text-sm font-semibold uppercase tracking-[0.18em]">Pendaftaran Siswa</p>
			<h1 class="font-raleway mt-3 text-4xl font-semibold sm:text-5xl">
				Mulai perjalanan belajarmu bersama Nuwaira
			</h1>
			<p class="mt-4 leading-7 text-slate-600">
				Isi data dengan benar sesuai identitas. Data ini digunakan untuk proses administrasi dan
				pendampingan selama program.
			</p>
		</div>

		<form method="post" class="space-y-6" novalidate>
			{#if form?.message}
				<div class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
					{form.message}
				</div>
			{/if}

			<fieldset class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
				<legend class="font-raleway px-2 text-2xl font-semibold">Data Diri</legend>

				<div class="mt-4 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-medium">Nama lengkap sesuai identitas (KTP)</span>
						<Input
							name="fullName"
							required
							autocomplete="name"
							placeholder="Nama lengkap"
							value={values.fullName ?? ''}
						/>
						{@render fieldError('fullName')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">NIK</span>
						<Input
							name="nik"
							required
							inputmode="numeric"
							pattern="[0-9]{16}"
							maxlength={16}
							placeholder="16 digit NIK"
							value={values.nik ?? ''}
						/>
						{@render fieldError('nik')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Tanggal lahir</span>
						<Input
							name="birthDate"
							required
							type="date"
							max={maxBirthDate}
							value={values.birthDate ?? ''}
						/>
						{@render fieldError('birthDate')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">WhatsApp</span>
						<Input
							name="whatsapp"
							required
							inputmode="tel"
							autocomplete="tel"
							placeholder="08xxxxxxxxxx"
							value={values.whatsapp ?? ''}
						/>
						{@render fieldError('whatsapp')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Email</span>
						<Input
							name="email"
							required
							type="email"
							autocomplete="email"
							placeholder="nama@email.com"
							value={values.email ?? ''}
						/>
						{@render fieldError('email')}
					</label>

					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-medium">Alamat lengkap</span>
						<Textarea
							name="fullAddress"
							required
							rows={4}
							placeholder="Dusun, RT/RW, jalan, nomor rumah, dan detail alamat lainnya"
							value={values.fullAddress ?? ''}
						/>
						{@render fieldError('fullAddress')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Provinsi</span>
						<select
							name="provinceId"
							required
							class={selectClass}
							value={provinceId}
							onchange={handleProvinceChange}
						>
							<option value="">Pilih provinsi</option>
							{#each data.provinces as province (province.id)}
								<option value={province.id}>{province.name}</option>
							{/each}
						</select>
						{@render fieldError('provinceId')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Kabupaten/kota (domisili)</span>
						<select
							name="regencyId"
							required
							class={selectClass}
							value={regencyId}
							onchange={handleRegencyChange}
							disabled={!provinceId || loadingLevel === 'regencies'}
						>
							<option value="">
								{loadingLevel === 'regencies' ? 'Memuat kabupaten/kota...' : 'Pilih kabupaten/kota'}
							</option>
							{#each regencies as regency (regency.id)}
								<option value={regency.id}>{regency.name}</option>
							{/each}
						</select>
						{@render fieldError('regencyId')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Kecamatan</span>
						<select
							name="districtId"
							required
							class={selectClass}
							value={districtId}
							onchange={handleDistrictChange}
							disabled={!regencyId || loadingLevel === 'districts'}
						>
							<option value="">
								{loadingLevel === 'districts' ? 'Memuat kecamatan...' : 'Pilih kecamatan'}
							</option>
							{#each districts as district (district.id)}
								<option value={district.id}>{district.name}</option>
							{/each}
						</select>
						{@render fieldError('districtId')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Kelurahan/desa</span>
						<select
							name="villageId"
							required
							class={selectClass}
							bind:value={villageId}
							disabled={!districtId || loadingLevel === 'villages'}
						>
							<option value="">
								{loadingLevel === 'villages' ? 'Memuat kelurahan/desa...' : 'Pilih kelurahan/desa'}
							</option>
							{#each villages as village (village.id)}
								<option value={village.id}>{village.name}</option>
							{/each}
						</select>
						{@render fieldError('villageId')}
					</label>

					{#if locationError}
						<p class="text-sm text-red-600 sm:col-span-2">{locationError}</p>
					{/if}

					<label class="grid gap-2">
						<span class="text-sm font-medium">Pendidikan aktif</span>
						<Input
							name="activeEducation"
							required
							placeholder="Contoh: SMA kelas 12, S1 Informatika"
							value={values.activeEducation ?? ''}
						/>
						{@render fieldError('activeEducation')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Agama</span>
						<select name="religion" required class={selectClass} value={values.religion ?? ''}>
							<option value="">Pilih agama</option>
							{#each religions as religion (religion)}
								<option value={religion}>{religion}</option>
							{/each}
						</select>
						{@render fieldError('religion')}
					</label>
				</div>
			</fieldset>

			<fieldset class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
				<legend class="font-raleway px-2 text-2xl font-semibold">Data Wali</legend>

				<div class="mt-4 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2 sm:col-span-2">
						<span class="text-sm font-medium">Nama wali</span>
						<Input
							name="guardianName"
							required
							placeholder="Nama lengkap wali"
							value={values.guardianName ?? ''}
						/>
						{@render fieldError('guardianName')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Hubungan dengan wali</span>
						<select
							name="guardianRelation"
							required
							class={selectClass}
							value={values.guardianRelation ?? ''}
						>
							<option value="">Pilih hubungan</option>
							{#each guardianRelations as relation (relation)}
								<option value={relation}>{relation}</option>
							{/each}
						</select>
						{@render fieldError('guardianRelation')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">WhatsApp wali</span>
						<Input
							name="guardianWhatsapp"
							required
							inputmode="tel"
							placeholder="08xxxxxxxxxx"
							value={values.guardianWhatsapp ?? ''}
						/>
						{@render fieldError('guardianWhatsapp')}
					</label>
				</div>
			</fieldset>

			<fieldset class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
				<legend class="font-raleway px-2 text-2xl font-semibold">Data Lainnya</legend>

				<div class="mt-4 grid gap-5">
					<label class="grid gap-2">
						<span class="text-sm font-medium">Dari mana mengetahui program ini?</span>
						<select
							name="referralSource"
							required
							class={selectClass}
							value={values.referralSource ?? ''}
						>
							<option value="">Pilih sumber informasi</option>
							{#each referralSources as source (source)}
								<option value={source}>{source}</option>
							{/each}
						</select>
						{@render fieldError('referralSource')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Tujuan mengikuti program ini</span>
						<Textarea
							name="programGoal"
							required
							rows={4}
							placeholder="Ceritakan target dan tujuan belajarmu"
							value={values.programGoal ?? ''}
						/>
						{@render fieldError('programGoal')}
					</label>

					<div class="grid gap-5 sm:grid-cols-2">
						<fieldset class="rounded-2xl border border-slate-200 p-4">
							<legend class="px-1 text-sm font-medium">Sudah memiliki basic programming?</legend>
							<div class="mt-3 flex gap-6">
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name="hasProgrammingBasics"
										value="yes"
										required
										checked={values.hasProgrammingBasics === 'yes'}
									/>
									<span>Ya</span>
								</label>
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name="hasProgrammingBasics"
										value="no"
										required
										checked={values.hasProgrammingBasics === 'no'}
									/>
									<span>Tidak</span>
								</label>
							</div>
							{@render fieldError('hasProgrammingBasics')}
						</fieldset>

						<fieldset class="rounded-2xl border border-slate-200 p-4">
							<legend class="px-1 text-sm font-medium">
								Sudah menggunakan tools AI sehari-hari?
							</legend>
							<div class="mt-3 flex gap-6">
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name="usesAiTools"
										value="yes"
										required
										checked={values.usesAiTools === 'yes'}
									/>
									<span>Ya</span>
								</label>
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name="usesAiTools"
										value="no"
										required
										checked={values.usesAiTools === 'no'}
									/>
									<span>Tidak</span>
								</label>
							</div>
							{@render fieldError('usesAiTools')}
						</fieldset>
					</div>
				</div>
			</fieldset>

			<fieldset class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
				<legend class="font-raleway px-2 text-2xl font-semibold">Keamanan Akun</legend>

				<div class="mt-4 grid gap-5 sm:grid-cols-2">
					<label class="grid gap-2">
						<span class="text-sm font-medium">Password</span>
						<div class="relative">
							<Input
								name="password"
								required
								type={showPassword ? 'text' : 'password'}
								autocomplete="new-password"
								minlength={8}
								class="pr-11"
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
								aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
								onclick={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<EyeOff class="size-4" />
								{:else}
									<Eye class="size-4" />
								{/if}
							</button>
						</div>
						{@render fieldError('password')}
					</label>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Konfirmasi password</span>
						<div class="relative">
							<Input
								name="confirmPassword"
								required
								type={showConfirmPassword ? 'text' : 'password'}
								autocomplete="new-password"
								minlength={8}
								class="pr-11"
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
								aria-label={showConfirmPassword
									? 'Sembunyikan konfirmasi password'
									: 'Tampilkan konfirmasi password'}
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
							>
								{#if showConfirmPassword}
									<EyeOff class="size-4" />
								{:else}
									<Eye class="size-4" />
								{/if}
							</button>
						</div>
						{@render fieldError('confirmPassword')}
					</label>
				</div>
			</fieldset>

			<div
				class="flex flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8"
			>
				<Turnstile bind:token={turnstileToken} />
				<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

				<Button
					type="submit"
					size="lg"
					class="bg-brand w-full rounded-full text-white sm:w-auto sm:px-12"
				>
					{#if loadingLevel}
						<Loader2 class="size-4 animate-spin" />
					{/if}
					Kirim Pendaftaran
				</Button>
				<p class="text-center text-sm text-slate-500">
					Dengan mengirim form, kamu menyatakan data yang diberikan sudah benar.
				</p>
			</div>
		</form>
	</div>
</main>
