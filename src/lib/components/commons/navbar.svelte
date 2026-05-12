<script lang="ts">
	import { page } from '$app/stores';
	import { Menu } from '@lucide/svelte';
	import { NAV_MENU } from '$lib/constants';
	import Button from '../ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	let mobileMenuOpen = false;
	const MOBILE_HEADER_OFFSET = 88;

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
			return 'rounded-full bg-brand-blue text-black shadow-sm hover:bg-white text-white border border-white';
		}

		return 'rounded-full bg-transparent text-white/85 hover:bg-white/12 hover:text-white';
	}

	$: if ($page.url.pathname) {
		mobileMenuOpen = false;
	}
</script>

<Sheet.Root bind:open={mobileMenuOpen}>
	<header class="sticky top-0 z-[70] w-full px-5 py-4 sm:px-8 lg:px-16">
		<div class="mx-auto flex h-14 items-center justify-between gap-3">
			<a href="/" class="inline-flex items-center shrink-0">
				<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-8 w-auto" />
			</a>

			<nav class="hidden md:flex items-center rounded-full p-1">
				{#each NAV_MENU as nav}
					{@const active = isActivePath(nav.url)}
					<Button
						variant="ghost"
						size="lg"
						class={`${getNavClass(active)} transition-colors text-base`}
						href={nav.url}
						aria-current={active ? 'page' : undefined}
					>
						{nav.title}
					</Button>
				{/each}

				<Button
					class="rounded-full !bg-white bg-transparent text-black hover:bg-white/10"
					size="lg"
					href="https://wa.me/6285235353944?text=Halo%20Nuwaira%2C%20saya%20ingin%20bertanya%20tentang%20program%20belajar."
					target="_blank"
					rel="noopener noreferrer"
				>
					Hubungi Kami
				</Button>
			</nav>

			<Sheet.Trigger
				class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-white/12 hover:text-white"
				aria-label="Buka menu"
			>
				<Menu class="size-5" />
			</Sheet.Trigger>
		</div>
	</header>

	<Sheet.Content
		side="top"
		style={`top: ${MOBILE_HEADER_OFFSET}px; max-height: calc(100svh - ${MOBILE_HEADER_OFFSET}px);`}
		class="md:hidden z-[55] overflow-y-auto border-white/15 bg-transparent backdrop-blur-sm px-5 pt-5 pb-6 sm:px-8"
	>
		<Sheet.Header class="sr-only">
			<Sheet.Title>Menu Navigasi</Sheet.Title>
			<Sheet.Description>Pilih halaman untuk navigasi.</Sheet.Description>
		</Sheet.Header>

		<nav>
			<ul class="flex flex-col gap-2">
				{#each NAV_MENU as nav}
					{@const active = isActivePath(nav.url)}
					<li>
						<Button
							variant="ghost"
							size="lg"
							class={`${getNavClass(active)} transition-colors w-full justify-start`}
							href={nav.url}
							aria-current={active ? 'page' : undefined}
							onclick={() => (mobileMenuOpen = false)}
						>
							{nav.title}
						</Button>
					</li>
				{/each}
				<li class="pt-2">
					<Button
						size="lg"
						class="w-full rounded-full border border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
						href="https://wa.me/6285235353944?text=Halo%20Nuwaira%2C%20saya%20ingin%20bertanya%20tentang%20program%20belajar."
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => (mobileMenuOpen = false)}
					>
						Hubungi Kami
					</Button>
				</li>
			</ul>
		</nav>
	</Sheet.Content>
</Sheet.Root>
