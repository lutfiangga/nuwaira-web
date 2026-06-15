<script lang="ts">
	import Navbar from '$lib/components/commons/navbar.svelte';
	import ProgramAudience from '$lib/sections/commons/program-audience-section.svelte';
	import ProgramFacilities from '$lib/sections/commons/program-facilities-section.svelte';
	import Faq from '$lib/sections/commons/faq.svelte';
	import ProgramHero from '$lib/sections/programs/program-hero-section.svelte';
	import ProgramIntro from '$lib/sections/programs/program-intro-section.svelte';
	import ProgramJourney from '$lib/sections/programs/program-journey-section.svelte';
	import ProgramPricing from '$lib/sections/programs/program-pricing-section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.program.title} | Nuwaira Academy</title>
	<meta name="description" content={data.program.summary} />
	<meta property="og:title" content={data.program.title} />
	<meta property="og:description" content={data.program.summary} />
	<meta property="og:image" content={data.program.heroImage} />
</svelte:head>

<Navbar />
<ProgramHero program={data.program} />
<ProgramIntro intro={data.program.intro} />
<ProgramAudience />
<ProgramJourney journey={data.program.journey} />
<ProgramFacilities />
<ProgramPricing pricing={data.program.pricing} />
<Faq faqs={data.sharedProgramContent.faqs} />
