<script lang="ts">

	import { Card } from '$lib/components/ui/card';
	import { BENEFITS } from '$lib/constants';
</script>
<section class="w-full max-w-5xl mx-auto flex flex-col gap-4 bg-transparent py-20 space-y-4">
	<p class="text-sm md:text-base text-brand-blue text-center">Nuwaira Tempat Belajar yang Tepat</p>
	<h2 class="text-2xl md:text-5xl font-semibold text-black text-center font-raleway">
		Belajar Langsung, Praktik Nyata <br />
		dan Kuasai Teknologi AI.
	</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
	{#each BENEFITS as benefit}
		<Card class="flex flex-col gap-4 justify-start items-start bg-[#fafafa] border-none shadow-none p-10 font-plus-jakarta">
			<benefit.icon className="w-8 h-8 text-brand-blue" />
			<h4 class="text-xl font-semibold">{benefit.title}</h4>
			<p class="text-gray-600">
				{benefit.description}
			</p>
		</Card>
		{/each}
	</div>
</section>