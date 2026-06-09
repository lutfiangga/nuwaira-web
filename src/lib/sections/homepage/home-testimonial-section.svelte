<script lang="ts">
	import { ChevronLeft, ChevronRight, Play, X } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	const videoTestimonials = [
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
	] as const;

	const reviews = [
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
	] as const;

	let activeVideo = $state(0);
	let activeReview = $state(0);
	let videoDialogOpen = $state(false);

	const videoTestimonial = $derived(videoTestimonials[activeVideo]);
	const review = $derived(reviews[activeReview]);

	function nextVideo() {
		activeVideo = (activeVideo + 1) % videoTestimonials.length;
	}

	function previousReview() {
		activeReview = (activeReview - 1 + reviews.length) % reviews.length;
	}

	function nextReview() {
		activeReview = (activeReview + 1) % reviews.length;
	}

	$effect(() => {
		if (videoDialogOpen) return;

		const interval = window.setInterval(nextVideo, 8000);
		return () => window.clearInterval(interval);
	});

	$effect(() => {
		const interval = window.setInterval(nextReview, 8000);
		return () => window.clearInterval(interval);
	});
</script>

<section class="my-12 w-full pb-16">
	<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-12">
		<p class="text-brand text-center text-base uppercase">Testimonial</p>
		<h2 class="font-raleway text-center text-4xl font-semibold md:text-6xl">
			Mereka Menguasai Skill Baru <br class="hidden sm:block" /> dan Mencapai Tujuannya
		</h2>
	</div>

	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-6 md:grid-cols-12">

	 <!-- Stats Card -->
		<div class="relative md:col-span-4 order-1">
			<div
				class="pointer-events-none absolute inset-y-5 right-0 z-0 w-12 rounded-r-3xl bg-[#164DC7] md:rounded-r-4xl"
				aria-hidden="true"
			></div>
			<article
				class="bg-brand relative w-[95%] z-10 flex h-full min-h-96 flex-col justify-between rounded-3xl p-6 text-white md:rounded-4xl"
			>
				<div class="flex items-start justify-between">
					<p class="text-xs font-medium uppercase tracking-wide text-white/80">Statistik</p>
					<div class="stat-ring rotate-90" aria-hidden="true"></div>
				</div>

				<div>
					<strong class="font-raleway text-6xl font-semibold">85%</strong>
					<p class="mt-2 max-w-36 text-lg leading-snug text-white/90">
						Lulusan bekerja di bidang IT
					</p>
				</div>
			</article>
		</div>

		<!-- video testimonial -->
		<article
			class="relative min-h-96 overflow-hidden rounded-[28px] bg-neutral-900 md:col-span-8 order-3 md:order-2"
		>
			<img
				src="https://img.youtube.com/vi/{videoTestimonial.youtubeId}/maxresdefault.jpg"
				alt="Video testimonial {videoTestimonial.name}"
				class="absolute inset-0 h-full w-full object-cover"
			/>
			<div class="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/30"></div>

			<div
				class="relative z-10 flex h-full min-h-96 items-end justify-between gap-6 p-8 text-white"
			>
				<div class="max-w-xl">
					<blockquote class="font-raleway text-3xl font-medium leading-tight md:text-4xl">
						"{videoTestimonial.quote}"
					</blockquote>
					<p class="mt-6 text-sm text-white/85">
						{videoTestimonial.name}, {videoTestimonial.role}
					</p>
				</div>

				<button
					type="button"
					aria-label="Putar video testimonial {videoTestimonial.name}"
					onclick={() => (videoDialogOpen = true)}
					class="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/30 md:size-20"
				>
					<Play class="ml-1 size-7 fill-current" />
				</button>
			</div>
		</article>

		<!-- partners -->
		<article
			class="flex min-h-96 flex-col justify-between rounded-[28px] bg-[#E7EEFF] p-6 md:col-span-4 order-2 md:order-3"
		>
			<div>
				<p class="text-brand text-xs font-medium uppercase tracking-wide">Partner Kami</p>
				<h3 class="font-raleway mt-5 text-3xl font-semibold leading-tight">
					Driving innovation through powerful collaboration
				</h3>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div class="flex h-14 items-center justify-center rounded-xl bg-white font-semibold">Google</div>
				<div class="flex h-14 items-center justify-center rounded-xl bg-white font-semibold">
					Microsoft
				</div>
				<div class="flex h-14 items-center justify-center rounded-xl bg-white font-semibold">AWS</div>
				<div class="flex h-14 items-center justify-center rounded-xl bg-white font-semibold">
				Cloudflared
				</div>
			</div>
		</article>

		<!-- student projects -->
		<article
			class="group relative min-h-96 overflow-hidden rounded-[28px] bg-neutral-900 text-white md:col-span-4 order-4"
		>
			<img
				src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&q=85"
				alt="Tampilan kode dari project siswa"
				class="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-60"
			/>
			<div class="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/30"></div>
			<div class="relative z-10 flex h-full min-h-96 flex-col justify-between p-7">
				<p class="text-xs font-medium uppercase tracking-wide text-white/80">Project Siswa</p>
				<div>
					<h3 class="font-raleway text-3xl font-semibold">AI Learning Assistant</h3>
					<p class="mt-2 text-sm text-white/70">Web application built by Nuwaira students</p>
				</div>
			</div>
		</article>

		<!-- reviews -->
		<article
			class="flex min-h-96 flex-col rounded-[28px] border border-slate-200 bg-white p-6 md:col-span-4 order-5"
		>
			<div class="flex items-center justify-between">
				<p class="text-brand text-xs font-medium uppercase tracking-wide">Reviews</p>
				<div class="flex gap-2">
					<button
						type="button"
						aria-label="Review sebelumnya"
						onclick={previousReview}
						class="bg-brand flex size-7 items-center justify-center rounded-full text-white transition hover:scale-110"
					>
						<ChevronLeft class="size-4" />
					</button>
					<button
						type="button"
						aria-label="Review berikutnya"
						onclick={nextReview}
						class="text-brand border-brand flex size-7 items-center justify-center rounded-full border transition hover:scale-110"
					>
						<ChevronRight class="size-4" />
					</button>
				</div>
			</div>

			<div class="flex flex-1 flex-col justify-end pt-8">
				<blockquote class="font-raleway text-2xl font-medium leading-snug">
					"{review.quote}"
				</blockquote>
				<div class="mt-8">
					<p class="text-brand text-sm font-semibold">{review.name}</p>
					<p class="mt-1 text-xs text-slate-500">{review.role}</p>
				</div>
			</div>
		</article>
	</div>
</section>

<Dialog.Root bind:open={videoDialogOpen}>
	<Dialog.Content
		class="max-w-5xl overflow-visible border-0 bg-transparent text-white shadow-none sm:max-w-5xl p-6"
		showCloseButton={false}
	>
		<Dialog.Title class="sr-only">
			Video testimonial {videoTestimonial.name}
		</Dialog.Title>

		<Dialog.Close
			aria-label="Tutup video testimonial"
			class="absolute -top-4 right-2 z-20 flex size-11 items-center justify-center rounded-full bg-white text-black shadow-xl transition hover:scale-110 hover:bg-slate-100 sm:-top-2 sm:-right-2"
		>
			<X class="size-6" />
		</Dialog.Close>

		{#if videoDialogOpen}
			<div class="aspect-video w-full overflow-hidden rounded-2xl bg-black">
				<iframe
					src="https://www.youtube.com/embed/{videoTestimonial.youtubeId}?autoplay=1&rel=0"
					title="Video testimonial {videoTestimonial.name}"
					class="h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<style>
	.stat-ring {
		width: 44px;
		aspect-ratio: 1;
		border: 3px solid rgb(255 255 255 / 0.95);
		border-left-color: transparent;
		border-radius: 9999px;
		transform: rotate(-35deg);
	}
</style>
