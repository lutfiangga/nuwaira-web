<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Turnstile from '$lib/components/turnstile.svelte';

	type LoginForm = {
		message?: string;
		errors?: Record<string, string[] | undefined>;
	};

	let { data, form }: { data: { returnTo?: string | null }; form?: LoginForm } = $props();

	const errors = $derived(form?.errors ?? {});
	let turnstileToken = $state('');
</script>

<svelte:head>
	<title>Login | Nuwaira Academy</title>
	<meta name="description" content="Masuk ke dashboard Nuwaira Academy." />
</svelte:head>

<main class="grid min-h-screen bg-slate-950 px-5 py-8 text-white lg:grid-cols-[0.9fr_1.1fr]">
	<section class="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-6">
		<a href="/" class="inline-flex w-fit items-center">
			<img src="/images/logo-wt.svg" alt="Nuwaira Academy" class="h-9 w-auto" />
		</a>

		<div class="max-w-xl py-16">
			<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Student Access</p>
			<h1 class="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
				Masuk dan lanjutkan proses bootcamp-mu.
			</h1>
			<p class="mt-5 text-base leading-7 text-white/70">
				Gunakan email yang dipakai saat pendaftaran.
			</p>
		</div>
	</section>

	<section
		class="w-full flex items-center justify-center gap-8 px-5 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"
	>
		<form
			method="post"
			class="w-full h-full rounded-lg bg-white p-6 text-slate-950 md:p-8 items-center justify-center flex flex-col"
		>
			<input type="hidden" name="returnTo" value={data.returnTo ?? ''} />
			<div class="mb-6 w-full">
				<p class="text-sm font-medium text-slate-500">Nuwaira Academy</p>
				<h2 class="mt-1 text-2xl font-semibold">Login</h2>
			</div>

			{#if form?.message}
				<div class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 w-full">
					{form.message}
				</div>
			{/if}

			<div class="space-y-4 w-full">
				<label class="grid gap-2">
					<span class="text-sm font-medium">Email</span>
					<Input
						name="email"
						required
						type="email"
						autocomplete="email"
						placeholder="nama@email.com"
					/>
					{#if errors.email}<span class="text-sm text-red-600">{errors.email[0]}</span>{/if}
				</label>

				<label class="grid gap-2">
					<span class="text-sm font-medium">Password</span>
					<Input name="password" required type="password" autocomplete="current-password" />
					{#if errors.password}<span class="text-sm text-red-600">{errors.password[0]}</span>{/if}
				</label>
			</div>

			<div class="mt-4 flex justify-center">
				<Turnstile bind:token={turnstileToken} />
			</div>
			<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

			<Button type="submit" class="mt-6 w-full rounded-md">Masuk</Button>

			<p class="mt-5 text-center text-sm text-slate-500">
				Belum terdaftar?
				<a
					href={data.returnTo ?? '/register'}
					class="font-medium text-blue-700 underline">Buat akun siswa</a
				>
			</p>
		</form>
	</section>
</main>
