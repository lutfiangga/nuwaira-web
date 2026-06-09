<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";

	interface Program {
		id: number;
		title: string;
		thumbnail: string;
		description: string;
		link: string;
	}

	const PROGRAMS: Program[] = [
		{
			id: 1,
			title: 'AI-Powered Web Development',
			thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&q=85',
			description:
				'Mulai dari nol, bangun fondasi web development yang solid. Kamu belajar coding modern sekaligus terbiasa bekerja bersama AI sejak hari pertama, bukan sebagai jalan pintas, tapi sebagai cara kerja profesional.',
			link: '/'
		},
		{
			id: 2,
			title: 'Ai-Driven Full-Stack Engineering',
			thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&q=85',
			description:
				'Masuk ke lapisan yang lebih dalam frontend, backend dan database, semuanya terhubung. Di level ini kamu mulai mengintegrasikan AI langsung ke dalam aplikasi yang kamu bangun, bukan hanya memakainya sebagai asisten.',
			link: '/'
		},
		{
			id: 3,
			title: 'AI-Led System Architecture',
			thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&q=85',
			description:
				'Bukan lagi sekadar membangun, kamu merancang. Program ini menyiapkan kamu untuk berpikir seperti seorang architect yang merancang sistem yang scalable, AI-ready, dan siap berjalan di lingkungan produksi nyata.',
			link: '/'
		}
	];
</script>

<section class="w-full max-w-7xl px-6 justify-center mx-auto py-12">
	<p class="text-base text-brand text-center uppercase">Program Unggulan Berbasis AI</p>
	<h2 class="text-4xl md:text-6xl font-semibold text-black text-center font-raleway px-6">
		Program yang Dirancang <br />
		Khusus Untuk Era AI dan Industri
	</h2>

	<div class="flex flex-col gap-4 py-6 md:py-12 w-full">
		{#each PROGRAMS as program (program.id)}
			<Card class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full border-0">
				<div class="p-6 space-y-8 order-2 {program.id % 2 === 0 ? 'md:order-2' : 'md:order-1'}">
					<h3 class="text-3xl md:text-5xl font-semibold text-black font-raleway">{program.title}</h3>
					<p class="text-base text-black">{program.description}</p>
					<Button variant="ghost" href={program.link} class="rounded-full bg-black text-white hover:bg-black/80 h-[52px] hover:scale-105 px-6 font-plus-jakarta font-thin hover:text-white">Lihat Detail Program</Button>
				</div>
				<div class="w-full h-full m-auto p-6 order-1 {program.id % 2 === 0 ? 'md:order-1' : 'md:order-2'}">
					<img src={program.thumbnail} alt={program.title} class="w-full h-full object-cover rounded-3xl md:rounded-4xl" />
				</div>
			</Card>
		{/each}
	</div>
</section>
