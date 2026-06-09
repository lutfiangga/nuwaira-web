<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { BENEFITS } from '$lib/constants';
</script>

<section class="w-full max-w-7xl mx-auto flex flex-col gap-4 py-6">
	<p class="text-base text-brand text-center uppercase">Nuwaira Tempat Belajar yang Tepat</p>
	<h2 class="text-3xl md:text-5xl font-semibold text-black text-center font-raleway px-6">
		Belajar Langsung, Praktik Nyata <br />
		dan Kuasai Teknologi AI.
	</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-4">
		{#each BENEFITS as benefit (benefit.title)}
			<Card
				class="flex flex-col gap-4 justify-between items-start bg-[#F5F7FB] border-[#F5F7FB] shadow-none p-10 font-plus-jakarta hover:border-brand hover:scale-105 rounded-4xl transition-all duration-300 h-[446px]"
			>
				<benefit.icon className="w-[80px] h-auto text-brand" />
				<div class="flex flex-col gap-2">
					<h4 class="text-4xl font-raleway">
						{benefit.title}
					</h4>
					<p class="text-gray-600 font-plus-jakarta text-base">
						{benefit.description}
					</p>
				</div>
			</Card>
		{/each}
	</div>
</section>
