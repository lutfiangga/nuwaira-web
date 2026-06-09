<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
</script>

<div class="w-full flex-1 flex flex-col max-w-7xl mx-auto items-center justify-center px-6 md:px-4 space-y-6">
	<div class="w-full max-w-5xl flex flex-col items-center text-center gap-6 px-6">
		<Badge class="font-semibold text-base bg-brand">
			Sekolah Coding & AI di Yogyakarta
		</Badge>

		<h1
			class="max-w-5xl text-4xl md:text-6xl font-semibold tracking-tight font-raleway"
		>
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
	<div class="w-full mx-auto mt-4">
		<img
			class="w-full max-h-96 object-cover rounded-3xl md:rounded-4xl"
			src="https://images.unsplash.com/photo-1758270705317-3ef6142d306f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="Team Students Collaboration"
		/>
	</div>
</div>
