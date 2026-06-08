<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	import PrimaryLogo from './icons/primary-logo.svelte';

	interface RouteItem {
		title: string;
		url: string;
		icon: any;
	}

	let {
		routes = [],
	}: { routes?: RouteItem[]; } = $props();

	const normalizeRoute = (url: string) =>
		url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;

	const isActiveRoute = (url: string, pathname: string) => {
		const current = normalizeRoute(pathname);
		const target = normalizeRoute(url);
		return current === target || current.startsWith(`${target}/`);
	};

	const brandName = 'Nuwaira Academy';
</script>

<Sidebar.Root variant="sidebar" class="border-0 bg-transparent">
	<Sidebar.Header class="px-5 pb-4 pt-6">
		<a href="/dashboard" class="group flex items-center justify-center gap-3 text-primary">
			<PrimaryLogo className="h-8 w-auto transition-transform group-hover:scale-105" />
			<span class="sr-only">{brandName}</span>
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

</Sidebar.Root>
