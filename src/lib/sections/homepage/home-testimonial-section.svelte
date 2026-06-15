<script lang="ts">
	import { ChevronLeft, ChevronRight, Play, X } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	type PersonItem = {
		quote: string;
		name: string;
		role: string;
	};

	type VideoTestimonial = PersonItem & {
		youtubeId: string;
	};

	type StatItem = {
		value: number;
		max: number;
		label: string;
		description: string;
	};

	const videoTestimonials: VideoTestimonial[] = [
		{
			quote: 'Banyak ilmu baru yang saya pelajari di sini',
			name: 'Seinly Ashvia',
			role: 'Software Engineer',
			youtubeId: 'PkZNo7MFNFg'
		},
		{
			quote: 'Belajar coding jadi lebih terarah dan mudah dipahami',
			name: 'Nadia Putri',
			role: 'Frontend Developer',
			youtubeId: 'mU6anWqZJcc'
		},
		{
			quote: 'Project nyata membuat saya lebih siap masuk industri',
			name: 'Rizky Maulana',
			role: 'Full-Stack Engineer',
			youtubeId: 'rfscVS0vtbw'
		}
	];

	const reviews: PersonItem[] = [
		{
			quote:
				'Nuwaira tidak cuma mengajarkan coding, tetapi juga cara berpikir dan bekerja seperti engineer di industri.',
			name: 'Muhammad Fulan',
			role: 'Software Engineer'
		},
		{
			quote:
				'Materinya relevan dan mentornya sangat membantu. Saya jadi lebih percaya diri membangun project sendiri.',
			name: 'Nadia Putri',
			role: 'Frontend Developer'
		},
		{
			quote:
				'Belajar AI terasa lebih terarah karena setiap konsep langsung diterapkan ke studi kasus dan project nyata.',
			name: 'Rizky Maulana',
			role: 'AI Engineer'
		}
	];

	const stats: StatItem[] = [
		{ value: 85, max: 100, label: '85%', description: 'Lulusan bekerja di bidang IT' },
		{ value: 11, max: 100, label: '11/100', description: 'Siswa diterima sebelum wisuda' },
		{ value: 92, max: 100, label: '92%', description: 'Tingkat kepuasan siswa' },
		{ value: 4.8, max: 5, label: '4.8/5', description: 'Rating rata-rata dari alumni' }
	];

	function createCarousel<T>(items: T[]) {
		let index = $state(0);
		const current = $derived(items[index]);

		return {
			get index() {
				return index;
			},
			get current() {
				return current;
			},
			next() {
				index = (index + 1) % items.length;
			},
			previous() {
				index = (index - 1 + items.length) % items.length;
			}
		};
	}

	function useAutoPlay(callback: () => void, delay: number, pause?: () => boolean) {
		$effect(() => {
			if (pause?.()) return;

			const interval = window.setInterval(callback, delay);
			return () => window.clearInterval(interval);
		});
	}

	const videos = createCarousel(videoTestimonials);
	const reviewCarousel = createCarousel(reviews);
	const statCarousel = createCarousel(stats);

	let videoDialogOpen = $state(false);

	const RING_RADIUS = 42;
	const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

	const statProgress = $derived(statCarousel.current.value / statCarousel.current.max);
	const statDashOffset = $derived(RING_CIRCUMFERENCE * (1 - statProgress));

	useAutoPlay(videos.next, 8000, () => videoDialogOpen);
	useAutoPlay(reviewCarousel.next, 8000);
	useAutoPlay(statCarousel.next, 6000);
</script>

<section class="my-12 w-full pb-16">
	<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-12">
		<p class="text-brand text-center text-base uppercase">Testimonial</p>
		<h2 class="font-raleway text-center text-4xl font-semibold md:text-6xl">
			Mereka Menguasai Skill Baru <br class="hidden sm:block" /> dan Mencapai Tujuannya
		</h2>
	</div>

	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-6 md:grid-cols-12">
		<!-- Stats -->
		<div class="relative order-1 md:col-span-4">
			<div
				class="pointer-events-none absolute inset-y-5 right-0 z-0 w-12 rounded-r-3xl bg-[#164DC7] md:rounded-r-4xl"
				aria-hidden="true"
			></div>

			<article
				class="bg-brand relative z-10 flex aspect-4/5 h-full min-h-96 w-[95%] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white md:rounded-4xl"
			>
				<div class="relative z-10 flex items-start justify-between">
					<p class="text-xs font-medium uppercase tracking-wide text-white/80">Statistik</p>

					<svg class="size-12 -rotate-90" viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r={RING_RADIUS}
							fill="none"
							stroke="white"
							stroke-width="6"
							stroke-linecap="round"
							stroke-dasharray={RING_CIRCUMFERENCE}
							stroke-dashoffset={statDashOffset}
							class="transition-all duration-700 ease-out"
						/>
					</svg>
				</div>

				<div class="relative z-10">
					<span class="font-raleway text-4xl font-bold text-white md:text-6xl">
						{statCarousel.current.label}
					</span>
					<p class="font-raleway mt-2 max-w-48 text-lg font-semibold leading-snug text-white md:text-xl">
						{statCarousel.current.description}
					</p>
				</div>
			</article>
		</div>

		<!-- Video Testimonial -->
		<article
			class="relative order-3 min-h-96 overflow-hidden rounded-[28px] bg-neutral-900 md:order-2 md:col-span-8"
		>
			<img
				src="https://img.youtube.com/vi/{videos.current.youtubeId}/maxresdefault.jpg"
				alt="Video testimonial {videos.current.name}"
				class="absolute inset-0 h-full w-full object-cover"
			/>

			<div class="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/30"></div>

			<div class="relative z-10 flex h-full min-h-96 items-end justify-between gap-6 p-8 text-white">
				<div class="max-w-xl">
					<blockquote class="font-raleway text-3xl font-medium leading-tight md:text-4xl">
						"{videos.current.quote}"
					</blockquote>
					<p class="mt-6 text-sm text-white/85">
						{videos.current.name}, {videos.current.role}
					</p>
				</div>

				<button
					type="button"
					aria-label="Putar video testimonial {videos.current.name}"
					onclick={() => (videoDialogOpen = true)}
					class="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/30 md:size-20"
				>
					<Play class="ml-1 size-7 fill-current" />
				</button>
			</div>
		</article>

		<!-- Partners -->
		<article
			class="order-2 flex min-h-96 flex-col justify-between rounded-[28px] bg-[#E7EEFF] p-6 md:order-3 md:col-span-4"
		>
			<div>
				<p class="text-brand text-xs font-medium uppercase tracking-wide">Partner Kami</p>
				<h3 class="font-raleway mt-5 text-3xl font-semibold leading-tight">
					Driving innovation through powerful collaboration
				</h3>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div class="flex h-12 select-none items-center justify-center rounded-xl bg-white">
					<img src="/images/partners/rajawali.svg" alt="Rajawali Indonesia" />
				</div>
				<div class="flex h-12 select-none items-center justify-center rounded-xl bg-white">
					<img src="/images/partners/tnt.svg" alt="Tiyasan Nusantara Teknologi" />
				</div>
				<div class="flex h-12 select-none items-center justify-center rounded-xl bg-white">
					<img src="/images/partners/kdi.svg" alt="KDI" />
				</div>
				<div class="flex h-12 select-none items-center justify-center rounded-xl bg-white">
					<img src="/images/partners/delameta.webp" alt="Delameta Bilano encosys" />
				</div>
				<div class="flex h-12 select-none items-center justify-center rounded-xl bg-white">
					<img src="/images/partners/nucare.svg" alt="NU Care Global" />
				</div>
			</div>
		</article>

		<!-- Student Projects -->
		<article
			class="group relative order-4 min-h-96 overflow-hidden rounded-[28px] bg-neutral-900 text-white md:col-span-4"
		>
			<div class="relative z-10 flex h-full min-h-96 flex-col justify-between p-7">
				<div class="flex flex-col space-y-4">
					<p class="text-xs font-medium uppercase tracking-wide text-white/80">Project Siswa</p>
					<p class="text-lg font-semibold text-white md:text-2xl">
						Lihat Apa yang Dibangun Siswa Nuwaira
					</p>
				</div>

				<button
					type="button"
					class="group/project relative cursor-pointer text-left"
					onclick={() => window.open('https://www.youtube.com/@nuwairaacademy', '_blank')}
				>
					<div
						class="pointer-events-none absolute -top-10 left-1/2 z-0 h-12 w-[80%] -translate-x-1/2 rounded-t-2xl bg-white transition-all duration-300 group-hover/project:-top-12"
						aria-hidden="true"
					></div>

					<div
						class="pointer-events-none absolute -top-5 left-1/2 z-10 h-12 w-[90%] -translate-x-1/2 rounded-t-2xl bg-[#164DC7] transition-all duration-300 group-hover/project:-top-6"
						aria-hidden="true"
					></div>

					<img
						src="/images/testimonial/testi.webp"
						alt="Tampilan kode dari project siswa"
						class="relative z-20 h-[160px] w-full rounded-2xl object-cover transition-all duration-300 group-hover/project:scale-105"
					/>
				</button>
			</div>
		</article>

		<!-- Reviews -->
		<article
			class="order-5 flex min-h-96 flex-col rounded-[28px] border border-slate-200 bg-white p-6 md:col-span-4"
		>
			<div class="flex items-center justify-between">
				<p class="text-brand text-xs font-medium uppercase tracking-wide">Reviews</p>

				<div class="flex gap-2">
					<button
						type="button"
						aria-label="Review sebelumnya"
						onclick={reviewCarousel.previous}
						class="bg-brand flex size-7 items-center justify-center rounded-full text-white transition hover:scale-110"
					>
						<ChevronLeft class="size-4" />
					</button>

					<button
						type="button"
						aria-label="Review berikutnya"
						onclick={reviewCarousel.next}
						class="text-brand border-brand flex size-7 items-center justify-center rounded-full border transition hover:scale-110"
					>
						<ChevronRight class="size-4" />
					</button>
				</div>
			</div>

			<div class="flex flex-1 flex-col justify-end pt-8">
				<blockquote class="font-raleway text-2xl font-medium leading-snug">
					"{reviewCarousel.current.quote}"
				</blockquote>

				<div class="mt-8">
					<p class="text-brand text-sm font-semibold">{reviewCarousel.current.name}</p>
					<p class="mt-1 text-xs text-slate-500">{reviewCarousel.current.role}</p>
				</div>
			</div>
		</article>
	</div>
</section>

<Dialog.Root bind:open={videoDialogOpen}>
	<Dialog.Content
		class="max-w-5xl overflow-visible border-0 bg-transparent p-6 text-white shadow-none sm:max-w-5xl"
		showCloseButton={false}
	>
		<Dialog.Title class="sr-only">Video testimonial {videos.current.name}</Dialog.Title>

		<Dialog.Close
			aria-label="Tutup video testimonial"
			class="absolute -top-4 right-2 z-20 flex size-11 items-center justify-center rounded-full bg-white text-black shadow-xl transition hover:scale-110 hover:bg-slate-100 sm:-right-2 sm:-top-2"
		>
			<X class="size-6" />
		</Dialog.Close>

		{#if videoDialogOpen}
			<div class="aspect-video w-full overflow-hidden rounded-2xl bg-black">
				<iframe
					src="https://www.youtube.com/embed/{videos.current.youtubeId}?autoplay=1&rel=0"
					title="Video testimonial {videos.current.name}"
					class="h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>