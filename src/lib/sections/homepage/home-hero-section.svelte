<script lang="ts">
	// import AnimatedHeroBg from '$lib/components/commons/animated-hero-bg.svelte';
	import Navbar from '$lib/components/commons/navbar.svelte';
	import HomeHeroContent from './home-hero-content.svelte';
</script>

<section
	class="w-full min-h-screen flex flex-col relative isolate overflow-hidden bg-[url('/images/hero-bg.png')] bg-cover bg-top"
>
	<!-- <AnimatedHeroBg /> -->

	<img
		src="/images/collaboration.svg"
		alt="collabs"
		class="absolute top-0 -right-24 lg:right-0 w-[24rem] lg:w-[44rem] h-auto will-change-transform select-none"
	/>
	<Navbar />
	<HomeHeroContent />
</section>
