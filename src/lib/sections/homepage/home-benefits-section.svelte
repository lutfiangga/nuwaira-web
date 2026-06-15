<script>
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { CircleArrowRight } from '@lucide/svelte';
</script>

<section class="w-full bg-[#F5F7FB] my-12 pb-16">
	<div class="w-full max-w-7xl px-6 justify-center mx-auto flex flex-col gap-4 py-12">
		<h2 class="text-4xl/12 md:text-6xl/16 text-center font-raleway font-semibold">
			Belajar Langsung, Praktik <br /> Nyata dan Kuasai Teknologi AI
		</h2>
	</div>
	<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl px-6 mx-auto space-y-4">
		<Card class="bg-white rounded-3xl md:rounded-4xl p-8 border-0">
			<h4 class="text-raleway text-4xl md:text-5xl font-medium"> <span class="text-brand">Sertifikat</span> Resmi Setelah Program Selesai</h4>
			<p class='font-plus-jakarta text-base text-[#47474B]'>Bukti kompetensi resmi dari Nuwaira Academy yang dapat digunakan untuk keperluan profesional dan pengembangan karir.</p>

			<Button size="lg" class="inline-flex gap-2 items-center bg-[#164DC7] px-6 h-12 w-fit rounded-full text-base font-plus-jakarta mt-12"> Pelajari Lebih Lanjut <CircleArrowRight class="h-6 w-6 p-4 text-white rounded-full" /></Button>
		</Card>
		<Card class="bg-white rounded-3xl md:rounded-4xl p-8 border-0">
			<h4 class="text-raleway text-4xl md:text-5xl font-medium">Komunitas Yang <span class="text-brand">Supportif</span> dan Adaptif</h4>
			<p class='font-plus-jakarta text-base text-[#47474B]'>Bergabung dengan jaringan alumni dan mentor aktif yang saling mendukung pertumbuhan profesional di industri teknologi.</p>
			<div class="inline-flex -space-x-2 items-center mt-12">
				<img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="inline-block size-10 rounded-full ring-2 ring-white outline -outline-offset-1 outline-white/10" />
				<img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="inline-block size-10 rounded-full ring-2 ring-white outline -outline-offset-1 outline-white/10" />
				<img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" class="inline-block size-10 rounded-full ring-2 ring-white outline -outline-offset-1 outline-white/10" />
				<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="inline-block size-10 rounded-full ring-2 ring-white outline -outline-offset-1 outline-white/10" />
				<span class="font-plus-jakarta font-semibold text-base ml-4 flex flex-col items-center">100+ Jaringan <br> Alumni dan Mitra</span>
			</div>

		</Card>
	</div>
</section>
