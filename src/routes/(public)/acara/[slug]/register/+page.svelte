<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import AcaraRegistrationForm from '$lib/sections/acara/acara-registration-form.svelte';
	import AcaraRegistrationSuccess from '$lib/sections/acara/acara-registration-success.svelte';

	type RegistrationForm = {
		message?: string;
		errors?: Record<string, string[] | undefined>;
		values?: Record<string, string>;
	};

	let {
		data,
		form
	}: {
		data: { event: { slug: string; title: string; description: string | null; eventType: string | null; startAt: Date | null; endAt: Date | null; location: string | null; priceAmount: number | null; imageUrl: string | null } };
		form?: RegistrationForm;
	} = $props();

	const registered = $derived($page.url.searchParams.get('registered') === 'true');

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}
		window.location.href = resolve(`/acara/${data.event.slug}`);
	}
</script>

<svelte:head>
	<title>Daftar {data.event.title} | Nuwaira Academy</title>
	<meta name="description" content="Pendaftaran acara {data.event.title}" />
</svelte:head>

<div class="w-full max-w-7xl px-6 my-16 mx-auto">
	<div class="mx-auto w-full max-w-3xl">
		<div class="mb-10 flex items-center justify-between gap-4">
			<a href={resolve('/')} class="inline-flex items-center">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-9 w-auto" />
			</a>
			<Button type="button" variant="outline" class="h-11 rounded-full bg-brand px-5 text-white hover:bg-blue-800 hover:text-white" onclick={goBack}>
				<ArrowLeft class="size-4" />
				Kembali
			</Button>
		</div>

		{#if registered}
			<AcaraRegistrationSuccess eventTitle={data.event.title} eventSlug={data.event.slug} />
		{:else}
			<AcaraRegistrationForm event={data.event} {form} />
		{/if}
	</div>
</div>
