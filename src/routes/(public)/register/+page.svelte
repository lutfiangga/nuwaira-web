<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Eye, EyeOff, ImagePlus, Loader2, UserRound, UsersRound } from '@lucide/svelte';
	import Turnstile from '$lib/components/turnstile.svelte';

	type RegistrationForm = {
		message?: string;
		errors?: Record<string, string[] | undefined>;
	};

	let { form }: { form?: RegistrationForm } = $props();

	let step = $state(1);
	let studentType = $state<'personal' | 'business'>('personal');
	let name = $state('');
	let education = $state('');
	let customEducation = $state('');
	let phone = $state('');
	let companyName = $state('');
	let motivation = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let photoInput = $state<HTMLInputElement | null>(null);
	let photoPreview = $state<string | null>(null);
	let photoStatus = $state('');
	let photoBusy = $state(false);
	let formAlert = $state('');
	let submittedStep = $state<1 | 2 | null>(null);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let turnstileToken = $state('');

	const educationOptions = [
		'SD sederajat',
		'SMP/MTs sederajat',
		'SMA/SMK sederajat',
		'D1',
		'D2',
		'D3',
		'D4',
		'S1',
		'S2',
		'S3',
		'Karyawan/Profesional',
		'Lainnya'
	];
	const errors = $derived(form?.errors ?? {});

	const val = (step: typeof submittedStep) =>
		({
			name: step === 1 && name.trim().length < 2 && 'Nama lengkap wajib diisi.',
			education: step === 1 && !education && 'Pendidikan wajib dipilih.',
			customEducation:
				step === 1 && education === 'Lainnya' && customEducation.trim().length < 2 && 'Tulis pendidikan lainnya terlebih dahulu.',
			phone: step === 1 && phone.trim().length < 8 && 'Nomor HP wajib diisi.',
			companyName:
				step === 1 && studentType === 'business' && companyName.trim().length < 2 && 'Nama bisnis/perusahaan wajib diisi untuk jalur business.',
			motivation: step === 1 && motivation.trim().length < 20 && 'Motivasi minimal 20 karakter.',
			email: step === 2 && !email.trim() && 'Email wajib diisi.' || step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && 'Format email belum valid.',
			password: step === 2 && password.length < 8 && 'Password minimal 8 karakter.',
			confirmPassword: step === 2 && confirmPassword.length < 8 && 'Konfirmasi password wajib diisi.' || step === 2 && password !== confirmPassword && 'Konfirmasi password tidak sama.'
		} as Record<string, string | false>);

	const clientErrors = $derived(
		Object.fromEntries(
			Object.entries(val(submittedStep)).filter(([, v]) => v)
		) as Record<string, string>
	);

	const stepOneRules = [
		{ test: () => name.trim().length < 2, message: 'Nama lengkap wajib diisi.' },
		{ test: () => !education, message: 'Pendidikan wajib dipilih.' },
		{ test: () => education === 'Lainnya' && customEducation.trim().length < 2, message: 'Tulis pendidikan lainnya terlebih dahulu.' },
		{ test: () => phone.trim().length < 8, message: 'Nomor HP wajib diisi.' },
		{ test: () => studentType === 'business' && companyName.trim().length < 2, message: 'Nama bisnis/perusahaan wajib diisi untuk jalur business.' },
		{ test: () => motivation.trim().length < 20, message: 'Motivasi minimal 20 karakter.' }
	] as const;

	const stepTwoRules = [
		{ test: () => !email.trim(), message: 'Email wajib diisi.' },
		{ test: () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), message: 'Format email belum valid.' },
		{ test: () => password.length < 8, message: 'Password minimal 8 karakter.' },
		{ test: () => confirmPassword.length < 8, message: 'Konfirmasi password wajib diisi.' },
		{ test: () => password !== confirmPassword, message: 'Konfirmasi password tidak sama.' },
		{ test: () => photoBusy, message: 'Tunggu proses foto selesai dulu.' }
	] as const;

	function clearFormAlert() {
		formAlert = '';
	}

	function validateStepOne() {
		return stepOneRules.find((r) => r.test())?.message ?? '';
	}

	function validateStepTwo() {
		return stepTwoRules.find((r) => r.test())?.message ?? '';
	}

	function nextStep() {
		submittedStep = 1;
		formAlert = validateStepOne();
		if (formAlert) return;

		formAlert = '';
		submittedStep = null;
		step = 2;
	}

	function previousStep() {
		formAlert = '';
		submittedStep = null;
		step = 1;
	}

	function handleSubmit(event: SubmitEvent) {
		submittedStep = 2;
		formAlert = validateStepTwo();
		if (formAlert) event.preventDefault();
	}

	async function handlePhotoChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			if (photoPreview) URL.revokeObjectURL(photoPreview);
			photoPreview = null;
			photoStatus = '';
			return;
		}

		photoBusy = true;
		photoStatus = 'Memproses foto...';

		try {
			const compressed = await compressImageToWebp(file);
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(compressed);
			input.files = dataTransfer.files;

			if (photoPreview) URL.revokeObjectURL(photoPreview);
			photoPreview = URL.createObjectURL(compressed);
			photoStatus = `${formatBytes(file.size)} -> ${formatBytes(compressed.size)} WebP`;
		} catch (error) {
			console.error('Photo processing failed:', error);
			input.value = '';
			photoPreview = null;
			photoStatus = 'Foto gagal diproses. Pilih gambar lain.';
		} finally {
			photoBusy = false;
		}
	}

	function compressImageToWebp(file: File) {
		return new Promise<File>((resolve, reject) => {
			const image = new Image();
			const url = URL.createObjectURL(file);

			image.onload = () => {
				const maxDimension = 960;
				const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
				const width = Math.max(1, Math.round(image.width * scale));
				const height = Math.max(1, Math.round(image.height * scale));
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;

				const context = canvas.getContext('2d');
				if (!context) {
					URL.revokeObjectURL(url);
					reject(new Error('Canvas tidak tersedia'));
					return;
				}

				context.drawImage(image, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						URL.revokeObjectURL(url);
						if (!blob) {
							reject(new Error('Gagal membuat WebP'));
							return;
						}

						const name = `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.webp`;
						resolve(new File([blob], name, { type: 'image/webp', lastModified: Date.now() }));
					},
					'image/webp',
					0.78
				);
			};

			image.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error('Gambar tidak valid'));
			};

			image.src = url;
		});
	}

	function formatBytes(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	}
</script>

<svelte:head>
	<title>Daftar Bootcamp | Nuwaira Academy</title>
	<meta
		name="description"
		content="Daftar bootcamp Nuwaira Academy untuk jalur personal atau business."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-950 text-white">
	<section
		class="mx-auto grid min-h-screen w-full max-w-full gap-8 px-5 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"
	>
		<div class="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-6">
			<a href="/" class="inline-flex w-fit items-center">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-9 w-auto" />
			</a>

			<div class="py-10">
				<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
					Bootcamp Intake
				</p>
				<h1 class="mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
					Mulai belajar coding dengan AI di jalur yang sesuai kebutuhanmu.
				</h1>
				<p class="mt-5 max-w-lg text-base leading-7 text-white/70">
					Pilih jalur personal untuk pengembangan diri, atau business untuk kebutuhan training tim
					dan perusahaan.
				</p>
			</div>
		</div>

		{#snippet err(field: string)}
			{@const msg = clientErrors[field] || errors[field]?.[0]}
			{#if msg}<span class="text-sm text-red-600">{msg}</span>{/if}
		{/snippet}

		<form
			method="post"
			enctype="multipart/form-data"
			novalidate
			oninput={clearFormAlert}
			onchange={clearFormAlert}
			onsubmit={handleSubmit}
			class="rounded-lg bg-white p-5 text-slate-950 shadow-2xl md:p-8"
		>
			<input type="hidden" name="studentType" value={studentType} />
			{#if step === 2}
				<input type="hidden" name="name" value={name} />
				<input type="hidden" name="education" value={education} />
				<input type="hidden" name="customEducation" value={customEducation} />
				<input type="hidden" name="phone" value={phone} />
				<input
					type="hidden"
					name="companyName"
					value={studentType === 'business' ? companyName : ''}
				/>
				<input type="hidden" name="motivation" value={motivation} />
			{/if}

			<div class="mb-6 flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-medium text-slate-500">Step {step} dari 2</p>
					<h2 class="text-2xl font-semibold">{step === 1 ? 'Profil pendaftar' : 'Akun'}</h2>
				</div>
				<div class="flex gap-2">
					<span class={`h-2.5 w-10 rounded-full ${step === 1 ? 'bg-blue-700' : 'bg-blue-200'}`}
					></span>
					<span class={`h-2.5 w-10 rounded-full ${step === 2 ? 'bg-blue-700' : 'bg-slate-200'}`}
					></span>
				</div>
			</div>

			{#if formAlert}
				<div
					class="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
				>
					{formAlert}
				</div>
			{/if}

			{#if form?.message}
				<div class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}

			{#if step === 1}
				<div class="space-y-5">
					<div class="grid gap-3 sm:grid-cols-2">
						<button
							type="button"
							class={`rounded-lg border p-4 text-left transition ${studentType === 'personal' ? 'border-blue-700 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
							onclick={() => {
								studentType = 'personal';
								clearFormAlert();
							}}
						>
							<UserRound class="h-5 w-5 text-blue-700" />
							<p class="mt-3 font-semibold">Personal</p>
							<p class="mt-1 text-sm text-slate-500">Untuk individu yang ingin upgrade skill.</p>
						</button>
						<button
							type="button"
							class={`rounded-lg border p-4 text-left transition ${studentType === 'business' ? 'border-blue-700 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
							onclick={() => {
								studentType = 'business';
								clearFormAlert();
							}}
						>
							<UsersRound class="h-5 w-5 text-blue-700" />
							<p class="mt-3 font-semibold">Business</p>
							<p class="mt-1 text-sm text-slate-500">
								Untuk kebutuhan training tim atau perusahaan.
							</p>
						</button>
					</div>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Nama lengkap</span>
						<Input
							name="name"
							required
							autocomplete="name"
							placeholder="Nama lengkap"
							bind:value={name}
						/>
						{@render err('name')}
					</label>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="grid gap-2">
							<span class="text-sm font-medium">Pendidikan</span>
							<select
								name="education"
								required
								bind:value={education}
								class="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
							>
								<option value="">Pilih pendidikan</option>
								{#each educationOptions as option (option)}
									<option value={option}>{option}</option>
								{/each}
							</select>
							{@render err('education')}
						</label>

						<label class="grid gap-2">
							<span class="text-sm font-medium">No HP</span>
							<Input
								name="phone"
								required
								inputmode="tel"
								autocomplete="tel"
								placeholder="08xxxxxxxxxx"
								bind:value={phone}
							/>
							{@render err('phone')}
						</label>
					</div>

					{#if education === 'Lainnya'}
						<label class="grid gap-2">
							<span class="text-sm font-medium">Tulis pendidikan</span>
							<Input
								name="customEducation"
								required
								placeholder="Contoh: Bootcamp, homeschooling, autodidak"
								bind:value={customEducation}
							/>
							{@render err('customEducation')}
						</label>
					{/if}

					{#if studentType === 'business'}
						<label class="grid gap-2">
							<span class="text-sm font-medium">Nama bisnis/perusahaan</span>
							<Input
								name="companyName"
								required
								placeholder="PT / brand / komunitas"
								bind:value={companyName}
							/>
							{@render err('companyName')}
						</label>
					{:else}
						<input type="hidden" name="companyName" value="" />
					{/if}

					<label class="grid gap-2">
						<span class="text-sm font-medium">Motivasi mengikuti bootcamp</span>
						<Textarea
							name="motivation"
							required
							rows={5}
							placeholder="Ceritakan target belajar atau kebutuhan trainingmu."
							bind:value={motivation}
						/>
						{@render err('motivation')}
					</label>

					<div class="flex justify-end">
						<Button type="button" class="rounded-md px-6" onclick={nextStep}>Lanjut</Button>
					</div>
				</div>
			{:else}
				<div class="space-y-5">
					<label class="grid gap-2">
						<span class="text-sm font-medium">Email</span>
						<Input
							name="email"
							required
							type="email"
							autocomplete="email"
							placeholder="nama@email.com"
							bind:value={email}
						/>
						{@render err('email')}
					</label>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="grid gap-2">
							<span class="text-sm font-medium">Password</span>
							<div class="relative">
								<Input
									name="password"
									required
									type={showPassword ? 'text' : 'password'}
									autocomplete="new-password"
									minlength={8}
									bind:value={password}
									class="pr-10"
								/>
								<button
									type="button"
									class="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
									aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
									onclick={() => (showPassword = !showPassword)}
								>
									{#if showPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							</div>
							{@render err('password')}
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
									bind:value={confirmPassword}
									class="pr-10"
								/>
								<button
									type="button"
									class="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
									aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
								>
									{#if showConfirmPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							</div>
							{@render err('confirmPassword')}
						</label>
					</div>

					<label class="grid gap-2">
						<span class="text-sm font-medium">Foto profil</span>
						<div
							class="grid gap-4 rounded-lg border border-dashed border-slate-300 p-4 sm:grid-cols-[120px_1fr]"
						>
							<div
								class="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-slate-100"
							>
								{#if photoPreview}
									<img
										src={photoPreview}
										alt="Preview foto profil"
										class="h-full w-full object-cover"
									/>
								{:else}
									<ImagePlus class="h-8 w-8 text-slate-400" />
								{/if}
							</div>
							<div class="flex flex-col justify-center gap-3">
								<Input
									bind:ref={photoInput}
									name="photo"
									type="file"
									accept="image/*"
									onchange={handlePhotoChange}
								/>
								{#if photoStatus}
									<p class="text-sm font-medium text-blue-700">{photoStatus}</p>
								{/if}
								{#if errors.photo}<span class="text-sm text-red-600">{errors.photo[0]}</span>{/if}
							</div>
						</div>
					</label>

					<div class="flex justify-center">
						<Turnstile bind:token={turnstileToken} />
					</div>
					<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

					<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
						<Button type="button" variant="outline" onclick={previousStep}>Kembali</Button>
						<Button type="submit" class="rounded-md px-6" disabled={photoBusy}>
							{#if photoBusy}
								<Loader2 class="h-4 w-4 animate-spin" />
								Menyiapkan foto
							{:else}
								Buat akun
							{/if}
						</Button>
					</div>
				</div>
			{/if}
		</form>
	</section>
</main>
