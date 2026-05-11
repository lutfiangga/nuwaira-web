<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
</script>

<div
	class="flex-1 flex flex-col max-w-5xl mx-auto flex items-center justify-center px-4 pb-12 md:pb-24 lg:pb-32"
>
	<div class="w-full flex flex-col items-center text-center gap-6 px-6">
		<Badge variant="glass" class="font-semibold text-sm md:text-base">
			Sekolah Coding & AI di Yogyakarta
		</Badge>

		<h1
			class="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white font-raleway"
		>
			Kuasai Keahlian Teknologi
			<br />
			<span class="text-white">Bersama Nuwaira Academy</span>
		</h1>

		<p class="max-w-4xl text-lg text-white leading-relaxed font-plus-jakarta">
			Belajar pemrograman secara personal langsung dari praktisi industri. Gabungkan metode belajar
			tatap muka dengan teknologi AI terbaru untuk percepatan karir digitalmu.
		</p>

		<div class="flex justify-between gap-2 md:gap-4 font-jakarta-plus *:text-base">
			<Button size="lg" class="rounded-full bg-white text-black hover:bg-white/80">
				Daftar Program
			</Button>
			<Button size="lg" class="rounded-full bg-black text-white hover:bg-black/80">
				Konsultasi Sekarang
			</Button>
		</div>
	</div>
</div>

