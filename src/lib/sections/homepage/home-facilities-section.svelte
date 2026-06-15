
<script lang="ts">
	import Carousel from '$lib/sections/commons/carousel.svelte';

	const images = [
		{
			src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&q=85',
			alt: 'Students collaborating around a table'
		},
		{
			src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&q=85',
			alt: 'Student carrying books on campus'
		},
		{
			src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&q=85',
			alt: 'Learning with a laptop and notebook'
		},
		{
			src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&q=85',
			alt: 'Team discussing ideas in a workshop'
		},
		{
			src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&q=85',
			alt: 'Student learning in a classroom'
		},
		{
			src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&q=85',
			alt: 'Students working together with laptops'
		}
	] as const;
</script>

<section class="w-full bg-brand my-12 pb-16">
	<div class="w-full max-w-7xl px-6 justify-center mx-auto flex flex-col gap-4 py-12">
		<h2 class="text-white text-4xl/12 md:text-6xl/16 text-center font-raleway font-semibold">
			Belajar dan Tumbuh di <br> #EraBaru Bersama Nuwaira
		</h2>
	</div>
	<Carousel {images} />
</section>
