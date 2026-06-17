<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import {
		ArrowUpRight,
		CalendarDays,
		ChevronDown,
		ChevronRight,
		Home,
		Info,
		Menu,
		MessageCircle
	} from '@lucide/svelte';
	import { NAV_MENU } from '$lib/constants';
	import Button from '../ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	let mobileMenuOpen = $state(false);
	let mobileExpandedMenu = $state<'programs' | null>(null);
	const visiblePrograms = $derived(
		($page.data.publicNavigation?.programs ?? []) as {
			slug: string;
			title: string;
			summary: string;
			eyebrow: string;
		}[]
	);

	function toggleMobileMenu(menu: 'programs') {
		mobileExpandedMenu = mobileExpandedMenu === menu ? null : menu;
	}

	function isActivePath(targetUrl: string) {
		const pathname = $page.url.pathname;

		if (!targetUrl.startsWith('/')) {
			return false;
		}

		if (targetUrl === '/') {
			return pathname === '/';
		}

		return pathname === targetUrl || pathname.startsWith(`${targetUrl}/`);
	}

	function getNavClass(active: boolean) {
		if (active) {
			return 'text-brand rounded-full font-bold';
		}

		return 'rounded-full bg-transparent text-slate-600 hover:bg-slate-100 hover:text-brand';
	}

	$effect(() => {
		if ($page.url.pathname) {
			mobileMenuOpen = false;
			mobileExpandedMenu = null;
		}
	});
</script>

<Sheet.Root bind:open={mobileMenuOpen}>
	<header
		class="sticky top-0 z-70 w-full bg-white px-5 py-3 sm:px-8 lg:px-16"
	>
		<div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
			<a href={resolve('/')} class="group inline-flex shrink-0 items-center">
				<img
					src="/images/logo.svg"
					alt="Nuwaira Academy"
					class="h-8 w-auto transition-transform duration-300 ease-out group-hover:scale-105"
					loading="eager"
					fetchpriority="high"
				/>
			</a>

			<nav
				class="hidden items-center gap-1 rounded-full bg-white p-1 md:flex"
			>
				{#each NAV_MENU as nav (nav.title)}
					{@const active = isActivePath(nav.url)}
					{#if nav.type === 'programs'}
						<div class="group relative">
							<Button
								variant="ghost"
								size="lg"
								class={`${getNavClass(active)} h-9 gap-1 px-4 text-sm transition-colors`}
								aria-current={active ? 'page' : undefined}
								aria-haspopup="true"
							>
								{nav.title}
								<ChevronDown class="size-4 transition-transform group-hover:rotate-180" />
							</Button>

							<div
								class="invisible absolute top-full left-1/2 z-80 w-[min(580px,calc(100vw-3rem))] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
							>
								<div
									class="rounded-3xl border border-slate-100 bg-white p-5"
								>
										<p class="px-2 mt-1 font-raleway text-xl font-semibold text-slate-900">
											Pilih program belajar Nuwaira
										</p>

									<div class="mt-4 space-y-1">
										{#each visiblePrograms as program (program.slug)}
											<Button
												variant="ghost"
												href={`/programs/${program.slug}`}
												class="group/program h-auto w-full justify-between gap-5 whitespace-normal rounded-2xl px-3 py-3.5 text-left hover:bg-[#f3f7ff] hover:text-brand"
											>
												<span>
													<span class="block font-raleway text-base font-semibold">
														{program.title}
													</span>
													<span
														class="mt-1 line-clamp-1 block text-xs font-normal leading-5 text-slate-400"
													>
														{program.summary}
													</span>
												</span>
												<span
													class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover/program:bg-brand group-hover/program:text-white"
												>
													<ChevronRight class="size-4" />
												</span>
											</Button>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{:else}
						<Button
							variant="ghost"
							size="lg"
							class={`${getNavClass(active)} h-9 px-4 text-sm transition-colors`}
							href={nav.url}
							aria-current={active ? 'page' : undefined}
						>
							{nav.title}
						</Button>
					{/if}
				{/each}

				<Button
					class="ml-1 h-9 rounded-full bg-black px-5 text-sm text-white transition hover:bg-[#0d398f] hover:text-white"
					size="lg"
					href="https://wa.me/6285235353944?text=Halo%20Nuwaira%2C%20saya%20ingin%20bertanya%20tentang%20program%20belajar."
					target="_blank"
					rel="noopener noreferrer"
				>
					Hubungi Kami
				</Button>
			</nav>

			<Sheet.Trigger
				class="inline-flex size-11 items-center justify-center rounded-full text-black transition hover:border-brand/30 hover:bg-[#f3f7ff] md:hidden"
				aria-label="Buka menu"
				aria-expanded={mobileMenuOpen}
			>
				<Menu class="size-5.5" />
			</Sheet.Trigger>
		</div>
	</header>

	<Sheet.Content
		side="right"
		class="z-80 h-dvh w-full max-w-[420px] gap-0 overflow-hidden border-l-0 bg-white p-0 md:hidden"
	>
		<Sheet.Header class="sr-only">
			<Sheet.Title>Menu Navigasi</Sheet.Title>
			<Sheet.Description>Pilih halaman untuk navigasi.</Sheet.Description>
		</Sheet.Header>

		<div class="flex h-full min-h-0 flex-col">
			<div class="shrink-0 border-b border-slate-100 px-6 py-5">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-8 w-auto" />
				<p class="mt-3 max-w-xs text-xs leading-5 text-slate-400">
					Sekolah coding dan AI untuk membangun kemampuan digital yang siap digunakan.
				</p>
			</div>

			<nav class="min-h-0 flex-1 overflow-y-auto px-4 py-5">
				<p class="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Navigasi</p>

				<ul class="mt-2 flex flex-col gap-1">
					{#each NAV_MENU as nav (nav.title)}
						{@const active = isActivePath(nav.url)}
						<li>
							{#if nav.type === 'programs'}
								<div class="mt-2 overflow-hidden rounded-3xl bg-[#f3f7ff] p-3">
									<button
										type="button"
										class="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left"
										aria-expanded={mobileExpandedMenu === 'programs'}
										onclick={() => toggleMobileMenu('programs')}
									>
										<span
											class="flex size-9 items-center justify-center rounded-full bg-brand text-white"
										>
											<CalendarDays class="size-4.5" />
										</span>
										<div>
											<p class="font-raleway text-base font-semibold text-brand">Program</p>
											<p class="text-[11px] text-slate-400">Pilih jalur belajar yang sesuai</p>
										</div>
										<ChevronRight
											class={`ml-auto size-4 text-brand transition-transform ${mobileExpandedMenu === 'programs' ? 'rotate-90' : ''}`}
										/>
									</button>

									{#if mobileExpandedMenu === 'programs'}
										<div class="mt-2 space-y-1">
											{#each visiblePrograms as program (program.slug)}
												<Button
													variant="ghost"
													class={`h-auto w-full justify-between gap-4 whitespace-normal rounded-2xl px-3 py-3 text-left ${
														$page.url.pathname === `/programs/${program.slug}`
															? 'bg-white text-brand hover:bg-white hover:text-brand'
															: 'text-slate-700 hover:bg-white/80 hover:text-brand'
													}`}
													href={`/programs/${program.slug}`}
													onclick={() => (mobileMenuOpen = false)}
												>
													<span>
														<span class="block font-raleway text-sm font-semibold"
															>{program.title}</span
														>
														<span
															class="mt-1 line-clamp-1 block text-[10px] font-normal text-slate-400"
														>
															{program.eyebrow}
														</span>
													</span>
													<ChevronRight class="size-4 shrink-0 text-slate-400" />
												</Button>
											{/each}
										</div>
									{/if}
								</div>
							{:else}
								<Button
									variant="ghost"
									size="lg"
									class={`h-12 w-full justify-start gap-3 rounded-2xl px-3 text-sm font-semibold transition ${
										active
											? 'bg-brand text-white hover:bg-brand hover:text-white'
											: 'text-slate-700 hover:bg-slate-50 hover:text-brand'
									}`}
									href={nav.url}
									aria-current={active ? 'page' : undefined}
									onclick={() => (mobileMenuOpen = false)}
								>
									{#if nav.title === 'Home'}
										<Home class="size-4.5" />
									{:else if nav.title === 'Tentang Kami'}
										<Info class="size-4.5" />
									{:else}
										<CalendarDays class="size-4.5" />
									{/if}
									{nav.title}
								</Button>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>

			<div class="shrink-0 border-t border-slate-100 bg-white p-4">
				<div class="rounded-3xl bg-brand p-4 text-white">
					<div class="flex items-start gap-3">
						<span
							class="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15"
						>
							<MessageCircle class="size-5" />
						</span>
						<div>
							<p class="font-raleway text-base font-semibold">Masih punya pertanyaan?</p>
							<p class="mt-1 text-xs leading-5 text-blue-100">
								Tim kami siap membantu memilih program yang tepat.
							</p>
						</div>
					</div>
					<Button
						size="lg"
						class="mt-4 h-11 w-full rounded-full bg-white text-brand hover:bg-blue-50 hover:text-brand"
						href="https://wa.me/6285235353944?text=Halo%20Nuwaira%2C%20saya%20ingin%20bertanya%20tentang%20program%20belajar."
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => (mobileMenuOpen = false)}
					>
						Hubungi Kami
						<ArrowUpRight class="size-4" />
					</Button>
				</div>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
