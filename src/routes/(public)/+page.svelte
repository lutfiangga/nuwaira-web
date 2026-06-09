<script lang="ts">
	import Navbar from '$lib/components/commons/navbar.svelte';
	import Hero from '$lib/sections/homepage/home-hero-section.svelte';
	import Features from '$lib/sections/homepage/home-feature-section.svelte';
	import Facilities from '$lib/sections/homepage/home-facilities-section.svelte';
	import Program from '$lib/sections/homepage/home-program-section.svelte';
	import Benefits from '$lib/sections/homepage/home-benefits-section.svelte';
	import Testimonial from '$lib/sections/homepage/home-testimonial-section.svelte';
</script>

<svelte:head>
	<title>Nuwaira Academy - Sekolah Coding & AI</title>
	<meta
		name="description"
		content="Nuwaira Academy adalah sekolah coding dan AI berbasis teknologi dengan metode belajar personal, tatap muka, dan didukung teknologi AI terkini. Dapatkan percepatan karir digitalmu bersama praktisi industri terpercaya."
	/>
</svelte:head>

<Navbar />
<Hero />
<Features />
<Facilities />
<Program />
<Benefits />
<Testimonial />
