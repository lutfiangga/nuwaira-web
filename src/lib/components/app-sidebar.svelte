<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	import { Bot, Sparkles } from '@lucide/svelte';
	import PrimaryLogo from './icons/primary-logo.svelte';

	interface RouteItem {
		title: string;
		url: string;
		icon: any;
	}

	let { routes = [] }: { routes?: RouteItem[] } = $props();

	const normalizeRoute = (url: string) =>
		url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;

	const isActiveRoute = (url: string, pathname: string) => {
		const current = normalizeRoute(pathname);
		const target = normalizeRoute(url);
		return current === target || current.startsWith(`${target}/`);
	};

	const brandLogo = $derived($page.data?.brand?.brandLogo);
	const brandName = $derived($page.data?.brand?.brandName || 'Nuwaira Academy');
</script>

<Sidebar.Root variant="sidebar" class="border-0 bg-transparent">
	<Sidebar.Header class="px-5 pb-4 pt-6">
		<a href="/dashboard" class="flex items-center gap-3 text-primary justify-center group">
			{#if brandLogo}
				<img src={brandLogo} alt={brandName} class="h-8 w-auto group-hover:scale-105 transition-transform" />
			{:else}
				<PrimaryLogo className="h-8 w-auto group-hover:scale-105 transition-transform" />
			{/if}
		</a>
	</Sidebar.Header>

	<Sidebar.Content class="px-3">
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="space-y-1">
					{#each routes as item (item.title)}
						{@const active = isActiveRoute(item.url, $page.url.pathname)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={active}
								class="h-10 rounded-xl px-3 text-sm transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-muted/80"
							>
								{#snippet child({ props })}
									<a href={item.url} class="flex w-full items-center gap-3" {...props}>
										<item.icon class="h-4 w-4" />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="p-3">
		<div class="rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-4">
			<div class="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
				<Sparkles class="h-3 w-3" />
				AI Powered
			</div>
			<p class="mt-2 text-sm font-medium">Copilot siap bantu workflow panel.</p>
			<a href="/dashboard" class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
				<Bot class="h-4 w-4" />
				Open Assistant
			</a>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
