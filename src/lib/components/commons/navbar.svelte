<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { NAV_MENU } from '$lib/constants';

	function isActivePath(targetUrl: string) {
		const pathname = $page.url.pathname;

		if (targetUrl === '/') {
			return pathname === '/';
		}

		return pathname === targetUrl || pathname.startsWith(`${targetUrl}/`);
	}
</script>

<header class="sticky top-0 z-50 w-full lg:px-24 md:px-12 sm:px-8 px-4 py-2">
	<div class="mx-auto flex h-16 items-center justify-between px-4">
		<a href="/" class="flex items-center cursor-pointer group">
			<img src="/images/logo.svg" alt="Nuwaira Academy" class="h-8 w-auto group-hover:scale-115 transition-all duration-300 select-none" />
		</a>

		<nav class="flex items-center gap-2">
			{#each NAV_MENU as nav}
				{@const active = isActivePath(nav.url)}
				<Button
					variant="ghost"
					size="lg"
					class={`rounded-full transition-colors select-none ${
						active
							? 'bg-white text-black hover:bg-white/90 hover:text-black'
							: 'text-white hover:text-black'
					}`}
					href={nav.url}
					aria-current={active ? 'page' : undefined}
				>
					{nav.title}
				</Button>
			{/each}

			<Button size="lg" href="#" class="rounded-full bg-white text-black hover:bg-white/80 select-none">
				Hubungi Kami
			</Button>
		</nav>
	</div>
</header>
