<script lang="ts">
	import { AUDIENCE_BENEFITS } from '$lib/constants';
</script>

<section class="bg-[#123887] px-5 py-16 text-white sm:px-8 lg:px-16 lg:py-20">
	<div class="mx-auto max-w-7xl">
		<h2
			class="mx-auto max-w-3xl text-center font-raleway text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl"
		>
			Dirancang Khusus untuk Kamu yang Siap Masuk #EraBaru
		</h2>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each AUDIENCE_BENEFITS as benefit (benefit.title)}
				<article class="rounded-3xl bg-[#2157cc] p-6 lg:p-8">
					<div class="mb-8">
						<svelte:component this={benefit.icon} class="size-12 stroke-[1.4]" />
					</div>
					<h3 class="font-raleway text-xl font-semibold">{benefit.title}</h3>
					<p class="mt-3 text-sm leading-6 text-blue-100">{benefit.description}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
