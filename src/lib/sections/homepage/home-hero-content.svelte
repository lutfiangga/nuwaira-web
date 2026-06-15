<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { LiquidGlass } from '$lib/components/ui/liquid-glass';
	import EvonicIcon from '$lib/components/icons/evonicIcon.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { SiGit, SiSvelte } from 'svelte-icons-pack/si';
	import { AiOutlineJavaScript } from 'svelte-icons-pack/ai';

	let refraction = $state(80);
	let depth = $state(12);
	let dispersion = $state(0);
	let frost = $state(0);
	let splay = $state(0);
	let lightAngle = $state(-45);
	let lightIntensity = $state(0.8);
</script>

<div
	class="w-full flex-1 flex flex-col max-w-7xl mx-auto items-center justify-center px-6 md:px-4 space-y-6 my-12"
>
	<div class="w-full max-w-5xl flex flex-col items-center text-center gap-6 px-6 py-12">
		<Badge class="text-base bg-brand h-12 px-6">Sekolah Coding & AI di Yogyakarta</Badge>

		<h1 class="max-w-5xl text-4xl/12 md:text-6xl/16 font-semibold tracking-tight font-raleway">
			Kuasai Skills Teknologi
			<br />
			<span class="text-brand">#EraBaru</span> Bersama Nuwaira
		</h1>

		<p class="max-w-3xl text-base leading-relaxed font-plus-jakarta">
			Belajar pemrograman secara personal langsung dari praktisi industri. Gabungkan metode belajar
			tatap muka dengan teknologi AI terbaru untuk percepatan karir digitalmu.
		</p>

		<div class="flex justify-between gap-2 md:gap-4 font-jakarta-plus *:text-base">
			<Button
				href="/register"
				size="lg"
				class="rounded-full bg-black text-white hover:bg-black/80 h-[52px] hover:scale-105"
			>
				Daftar Program
			</Button>
			<Button
				href="https://wa.me/6285235353944?text=Halo%20Nuwaira%2C%20saya%20ingin%20konsultasi%20program."
				target="_blank"
				rel="noopener noreferrer"
				size="lg"
				class="rounded-full bg-[#F5F7FB] text-black hover:bg-[#F5F7FB]/80 h-[52px] hover:scale-105 hover:border"
			>
				Konsultasi Sekarang
			</Button>
		</div>
	</div>
	<div class="relative mx-auto mt-4 h-[550px] w-full overflow-hidden rounded-3xl md:rounded-4xl">
	<img
		class="absolute inset-0 h-full w-full object-cover object-center"
		src="/images/homepage/hero.webp"
		alt="Team Students Collaboration"
	/>

	<!-- Top Left -->
	<div class="absolute left-8 top-12 z-10 md:left-56 md:top-16">
		<LiquidGlass
			variant="card"
			className="-rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105"
			{refraction}
			{depth}
			{dispersion}
			{frost}
			{splay}
			{lightAngle}
			{lightIntensity}
		>
			<EvonicIcon className="h-auto w-16 p-3 md:w-20 md:p-4" />
		</LiquidGlass>
	</div>

	<!-- Top Right -->
	<div class="absolute right-8 top-12 z-10 md:right-56 md:top-16">
		<LiquidGlass
			variant="card"
			className="rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105"
			{refraction}
			{depth}
			{dispersion}
			{frost}
			{splay}
			{lightAngle}
			{lightIntensity}
		>
			<Icon src={SiGit} className="h-auto w-16 p-3 md:w-20 md:p-4" color="white" />
		</LiquidGlass>
	</div>

	<!-- Bottom Left -->
	<div class="absolute bottom-12 left-4 z-10 md:bottom-16 md:left-32">
		<LiquidGlass
			variant="card"
			className="rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105"
			{refraction}
			{depth}
			{dispersion}
			{frost}
			{splay}
			{lightAngle}
			{lightIntensity}
		>
			<Icon src={SiSvelte} className="h-auto w-16 p-3 md:w-20 md:p-4" color="white" />
		</LiquidGlass>
	</div>

	<!-- Bottom Right -->
	<div class="absolute bottom-12 right-4 z-10 md:bottom-16 md:right-32">
		<LiquidGlass
			variant="card"
			className="-rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105"
			{refraction}
			{depth}
			{dispersion}
			{frost}
			{splay}
			{lightAngle}
			{lightIntensity}
		>
			<Icon
				src={AiOutlineJavaScript}
				className="h-auto w-16 p-3 md:w-20 md:p-4"
				color="white"
			/>
		</LiquidGlass>
	</div>
</div>
</div>
