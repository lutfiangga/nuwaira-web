<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	import type { Component } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';
	import PrimaryLogo from './icons/primary-logo.svelte';

	type PanelRoute =
		| '/dashboard'
		| '/programs'
		| '/milestones'
		| '/intros'
		| '/metrics'
		| '/offerings'
		| '/batches'
		| '/events'
		| '/enrollments'
		| '/attendance'
		| '/profile'
		| '/students'
		| '/prospective-students'
		| '/users';

	interface LeafRoute {
		title: string;
		url: string;
		icon: Component<{ class?: string }>;
	}

	interface ParentRoute {
		title: string;
		icon: Component<{ class?: string }>;
		children: LeafRoute[];
	}

	type RouteItem = LeafRoute | ParentRoute;

	interface RouteGroup {
		title: string;
		routes: RouteItem[];
	}

	let { groups = [] }: { groups?: RouteGroup[] } = $props();

	let openParents = $state<Set<string>>(new Set());

	const normalizeRoute = (url: string) =>
		url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;

	const isActiveRoute = (url: string, pathname: string) => {
		const current = normalizeRoute(pathname);
		const target = normalizeRoute(url);
		return current === target || current.startsWith(`${target}/`);
	};

	const isParentActive = (parent: ParentRoute, pathname: string) =>
		parent.children.some((c) => isActiveRoute(c.url, pathname));

	const isOpen = (title: string) => {
		// Auto-open if a child route is active
		const route = findRouteByTitle(title);
		if (route && 'children' in route && isParentActive(route, $page.url.pathname)) return true;
		return openParents.has(title);
	};

	const findRouteByTitle = (title: string): ParentRoute | undefined => {
		for (const group of groups) {
			for (const route of group.routes) {
				if ('children' in route && route.title === title) return route;
			}
		}
		return undefined;
	};

	const toggleParent = (title: string) => {
		const next = new Set(openParents);
		if (next.has(title)) {
			next.delete(title);
		} else {
			next.add(title);
		}
		openParents = next;
	};

	const brandName = 'Nuwaira Academy';
</script>

<Sidebar.Root variant="sidebar" class="border-0 bg-transparent">
	<Sidebar.Header class="px-5 -py-8">
		<a
			href={resolve('/dashboard')}
			class="group flex items-center justify-center gap-3 text-primary"
		>
			<PrimaryLogo className="h-auto w-32 transition-transform group-hover:scale-105" />
			<span class="sr-only">{brandName}</span>
		</a>
	</Sidebar.Header>

	<Sidebar.Content class="px-3">
		{#each groups as group (group.title)}
			<Sidebar.Group class="mb-1">
				<Sidebar.GroupLabel class="px-3 pb-1 pt-3 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
					{group.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu class="space-y-0.5">
						{#each group.routes as item (item.title)}
							{#if 'children' in item}
								<!-- Parent with collapsible children -->
								{@const open = isOpen(item.title)}
								{@const parentActive = isParentActive(item, $page.url.pathname)}
								<Sidebar.MenuItem>
									<button
										type="button"
										onclick={() => toggleParent(item.title)}
										class="flex h-9 w-full items-center gap-3 rounded-xl px-3 text-sm transition-all {parentActive ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-muted/80'}"
									>
										<item.icon class="h-4 w-4 shrink-0" />
										<span class="flex-1 text-left">{item.title}</span>
										<ChevronRight class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform {open ? 'rotate-90' : ''}" />
									</button>

									{#if open}
										<Sidebar.MenuSub class="ml-1">
											{#each item.children as sub (sub.url)}
												{@const childActive = isActiveRoute(sub.url, $page.url.pathname)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton isActive={childActive}>
														{#snippet child({ props })}
															<a href={sub.url} class="flex w-full items-center gap-2" {...props}>
																<sub.icon class="h-3.5 w-3.5" />
																<span>{sub.title}</span>
															</a>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									{/if}
								</Sidebar.MenuItem>
							{:else}
								<!-- Leaf route (direct link) -->
								{@const active = isActiveRoute(item.url, $page.url.pathname)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={active}
										class="h-9 rounded-xl px-3 text-sm transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-muted/80"
									>
										{#snippet child({ props })}
											<a href={item.url} class="flex w-full items-center gap-3" {...props}>
												<item.icon class="h-4 w-4" />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/if}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
