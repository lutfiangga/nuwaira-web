<script lang="ts">
	import { FACILITIES } from '$lib/constants';
</script>

<section class="overflow-hidden px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<h2
			class="mx-auto max-w-3xl text-center font-raleway text-3xl leading-tight font-semibold text-black sm:text-4xl lg:text-5xl"
		>
			Fasilitas & Gedung Belajar yang Mendukung
		</h2>

		<div
			class="mt-10 grid auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto pb-4 sm:auto-cols-[45%] lg:grid-cols-5 lg:overflow-visible"
		>
			{#each FACILITIES as facility (facility.label)}
				<figure class="group relative overflow-hidden rounded-2xl bg-slate-100">
					<img
						src={facility.src}
						alt={facility.alt}
						class="aspect-[3/4] h-full w-full object-cover transition duration-500 group-hover:scale-105"
						loading="lazy"
					/>
					<figcaption
						class="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-800 uppercase shadow-sm"
					>
						{facility.label}
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
