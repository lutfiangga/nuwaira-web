<script lang="ts">
	import AcaraEventGridSection from '$lib/sections/acara/acara-event-grid-section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Acara | Nuwaira Academy</title>
	<meta name="description" content="Daftar acara dan kegiatan Nuwaira Academy - workshop, seminar, webinar, dan bootcamp teknologi." />
</svelte:head>

<main class="w-full max-w-7xl px-6 mx-auto py-12">
	<AcaraEventGridSection events={data.events} />
</main>