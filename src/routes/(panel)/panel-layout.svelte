<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import {
		LayoutDashboard,
		Users,
		SettingsIcon,
		LogOut,
		User,
		Store,
		ChartColumnStacked,
		MapPinned,
		Package,
		FolderOpen,
		Newspaper,
		Utensils,
		Camera,
		ShieldCheck,
		Palette,
		Search,
		Bell,
		CalendarDays,
		ChevronDown,
		Sparkles,
		Loader
	} from '@lucide/svelte';
	import { page } from '$app/stores';

	let { data, children }: any = $props();

	type PanelRoute = {
		title: string;
		url: string;
		icon: any;
	};

	const iconMap = {
		LayoutDashboard,
		Users,
		SettingsIcon,
		Store,
		ChartColumnStacked,
		MapPinned,
		Package,
		FolderOpen,
		Newspaper,
		Utensils,
		Camera,
		ShieldCheck,
		Palette
	};

	const normalizeRoute = (url: string) =>
		url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;

	const routes = $derived.by((): PanelRoute[] => {
		return (data?.panelMenu ?? []).map((item: any) => ({
			title: item.title,
			url: item.url,
			icon: iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
		}));
	});

	const routeLabelMap = $derived.by(() => {
		return routes.reduce(
			(acc: Record<string, string>, item: PanelRoute) => ({
				...acc,
				[normalizeRoute(item.url)]: item.title
			}),
			{} as Record<string, string>
		);
	});

	const currentPath = $derived(normalizeRoute($page.url.pathname));
	const isDashboardPage = $derived(currentPath === '/dashboard');

	const pageTitle = $derived.by(() => {
		const mappedTitle = routeLabelMap[currentPath];
		if (mappedTitle) {
			return mappedTitle;
		}
		const fallbackSegment = currentPath.split('/').filter(Boolean).at(-1) ?? 'dashboard';
		return `${fallbackSegment.charAt(0).toUpperCase()}${fallbackSegment.slice(1)}`;
	});

	const displayName = $derived.by(() => data?.user?.name || data?.user?.username || 'User');
	const displayUsername = $derived.by(() =>
		data?.user?.username ? `@${data.user.username}` : '@user'
	);
	const firstName = $derived.by(() => displayName.split(/\s+/)[0] || 'User');

	let imgError = $state(false);
	let searchQuery = $state('');
	let searchResults = $state<{ title: string; subtitle: string; href: string; module: string }[]>([]);
	let searchOpen = $state(false);
	let searchLoading = $state(false);
	let searchTimer: ReturnType<typeof setTimeout>;
	let searchRef = $state<HTMLInputElement | null>(null);

	function handleKeyDown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			searchRef?.focus();
		}
	}

	async function doSearch(q: string) {
		if (q.length < 2) { searchResults = []; searchOpen = false; return; }
		searchLoading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
			const data = await res.json();
			searchResults = data.results ?? [];
			searchOpen = searchResults.length > 0;
		} catch { searchResults = []; }
		finally { searchLoading = false; }
	}

	function onSearchInput(e: Event) {
		searchQuery = (e.target as HTMLInputElement).value;
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => doSearch(searchQuery), 250);
	}

	function closeSearch() { searchOpen = false; searchQuery = ''; searchResults = []; }

	$effect(() => {
		if (data?.user?.photo) {
			imgError = false;
		}
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<Sidebar.Provider class="font-plus-jakarta bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
	<AppSidebar {routes} />

	<main class="flex min-h-screen w-full flex-col p-2 md:p-4">
		<section class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-background/90 backdrop-blur">
			<header class="flex items-center gap-3 bg-gradient-to-r from-primary/5 via-transparent to-transparent border-b px-4 py-3 md:px-5">
				<Sidebar.Trigger class="md:hidden" />

				<div class="hidden relative flex-1 md:block">
					<label class="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 transition-shadow hover:shadow-sm">
						{#if searchLoading}
							<Loader class="h-4 w-4 text-muted-foreground animate-spin" />
						{:else}
							<Search class="h-4 w-4 text-muted-foreground" />
						{/if}
						<input
							type="search"
							placeholder="Search anything..."
							class="w-full border-none bg-transparent text-sm outline-none"
							bind:this={searchRef}
							value={searchQuery}
							oninput={onSearchInput}
							onkeydown={(e) => { if (e.key === 'Escape') closeSearch(); }}
							onfocus={() => { if (searchResults.length > 0) searchOpen = true; }}
							onblur={() => setTimeout(closeSearch, 200)}
						/>
						<span class="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground">Ctrl+K</span>
					</label>

					{#if searchOpen && searchResults.length > 0}
						<div class="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border bg-popover shadow-md overflow-hidden">
							{#each searchResults as result}
								<a href={result.href} class="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0">
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium truncate">{result.title}</p>
										<p class="text-xs text-muted-foreground truncate">{result.subtitle}</p>
									</div>
									<span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{result.module}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<div class="ml-auto flex items-center gap-2">
					<button type="button" class="hidden items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm sm:flex hover:bg-muted/50 transition-colors">
						<CalendarDays class="h-4 w-4 text-primary/70" />
						Today
						<ChevronDown class="h-4 w-4 text-muted-foreground" />
					</button>

					<button type="button" class="relative rounded-xl border bg-background p-2 hover:bg-muted/50 transition-colors">
						<Bell class="h-4 w-4" />
						<span class="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground ring-2 ring-background">3</span>
					</button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex items-center gap-2 rounded-xl border bg-background p-1 pr-2 hover:bg-muted/50 transition-colors">
							{#if data?.user?.photo && !imgError}
								<img src={data.user.photo} alt="Profile" class="h-8 w-8 rounded-lg object-cover" onerror={() => (imgError = true)} />
							{:else}
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<User class="h-4 w-4" />
								</div>
							{/if}
							<div class="hidden text-left sm:block">
								<p class="max-w-32 truncate text-sm font-medium">{displayName}</p>
								<p class="text-xs text-muted-foreground">{displayUsername}</p>
							</div>
							<ChevronDown class="h-4 w-4 text-muted-foreground" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-56">
							<DropdownMenu.Label>
								<div class="flex items-center gap-2">
									<Sparkles class="h-3 w-3 text-primary" />
									{firstName}
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<a href="/settings" class="flex items-center gap-2">
									<SettingsIcon class="h-4 w-4" />
									<span>Settings</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<a href="/logout" class="flex items-center gap-2">
									<LogOut class="h-4 w-4" />
									<span>Logout</span>
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</header>

			<div class="min-h-0 flex-1 overflow-auto p-4 md:p-5">
				{#if !isDashboardPage}
					<div class="mb-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 p-5">
						<h1 class="text-xl font-semibold">{pageTitle}</h1>
						<p class="mt-1 text-sm text-muted-foreground">
							Halaman data detail tetap gunakan DataTable untuk sort/search/pagination.
						</p>
					</div>
				{/if}

				{@render children?.()}
			</div>
		</section>
	</main>
</Sidebar.Provider>
