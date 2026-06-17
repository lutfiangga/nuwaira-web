
<script lang="ts">
	import Carousel from '$lib/sections/commons/carousel.svelte';

	const images = [
		{
			src: '/images/homepage/1.jpg',
			alt: 'Students collaborating around a table'
		},
		{
			src: '/images/homepage/2.jpg',
			alt: 'Student carrying books on campus'
		},
		{
			src: '/images/homepage/3.png',
			alt: 'Learning with a laptop and notebook'
		},
		{
			src: '/images/homepage/4.jpg',
			alt: 'Team discussing ideas in a workshop'
		},
		{
			src: '/images/homepage/5.jpg',
			alt: 'Student learning in a classroom'
		}
	] as const;
</script>

<section class="w-full bg-brand my-12 pb-16">
	<div class="w-full max-w-7xl px-6 justify-center mx-auto flex flex-col gap-4 py-12">
		<h2 class="text-white text-4xl/12 md:text-6xl/16 text-center font-raleway font-semibold">
			Jadilah Bagian Dari Komunitas <br> Yang Supportif dan Adaptif
		</h2>
	</div>
	<Carousel {images} />
</section>
