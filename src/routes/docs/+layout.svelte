<script lang="ts">
	import { page } from '$app/stores';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { BookOpen, Code2, Layers, Box, Terminal, FolderGit2, FileCode, Newspaper, Database, Utensils, Camera, Grid3x3, Package, Users, MapPin, FolderTree, Table } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	const docs = [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Introduction', href: '/docs', icon: BookOpen },
				{ title: 'Installation', href: '/docs/installation', icon: Terminal },
				{ title: 'Folder Structure', href: '/docs/structure', icon: FolderGit2 }
			]
		},
		{
			title: 'Development',
			items: [
				{ title: 'Core Features', href: '/docs/modules', icon: Box },
                { title: 'Database & Seeding', href: '/docs/database', icon: Database },
				{ title: 'Code Examples', href: '/docs/examples', icon: FileCode },
				{ title: 'Create New Module', href: '/docs/create-module', icon: Code2 }
			]
		},
		{
			title: 'Modules',
			items: [
				{ title: 'News', href: '/docs/news', icon: Newspaper },
				{ title: 'Menu', href: '/docs/menu', icon: Utensils },
				{ title: 'Moments', href: '/docs/moments', icon: Camera },
				{ title: 'Products', href: '/docs/products', icon: Package },
				{ title: 'Categories', href: '/docs/categories', icon: FolderTree },
				{ title: 'Users', href: '/docs/users', icon: Users },
				{ title: 'Outlets', href: '/docs/outlets', icon: MapPin }
			]
		},
		{
			title: 'Components',
			items: [
				{ title: 'DataGrid', href: '/docs/datagrid', icon: Grid3x3 },
				{ title: 'DataTable', href: '/docs/datatable', icon: Table }
			]
		}
	];

	let { children } = $props();

	// Table of Contents State
	let headings: { id: string; text: string; level: number }[] = $state([]);
	let activeId = $state('');
	let observer: IntersectionObserver;

	function updateToc() {
		// Wait for DOM update
		setTimeout(() => {
			const elements = Array.from(document.querySelectorAll('main h2, main h3'));
			headings = elements.map((el, i) => {
				if (!el.id) el.id = `heading-${i}`;
				return {
					id: el.id,
					text: el.textContent || '',
					level: parseInt(el.tagName[1])
				};
			});

			if (observer) observer.disconnect();

			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							activeId = entry.target.id;
						}
					});
				},
				{
					rootMargin: '0px 0px -80% 0px'
				}
			);

			elements.forEach((el) => observer.observe(el));
		}, 100);
	}

	onMount(() => {
		updateToc();
		return () => observer?.disconnect();
	});

	afterNavigate(() => {
		updateToc();
	});
</script>

<div class="flex min-h-screen w-full max-w-7xl mx-auto flex-col bg-background">
	<!-- Modern Header -->
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container flex h-14 items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="flex items-center gap-2 font-bold text-lg tracking-tight">
					<Layers class="h-6 w-6" />
					<span>Project Docs</span>
				</a>
				<Badge variant="secondary" class="font-normal text-xs">v1.0.0</Badge>
			</div>
			<nav class="flex items-center gap-4 text-sm font-medium">
				<a
					href="/panel/dashboard"
					class="transition-colors hover:text-primary text-muted-foreground">Dashboard</a
				>
				<a
					href="https://github.com/lutfiangga"
					target="_blank"
					class="transition-colors hover:text-primary text-muted-foreground">GitHub</a
				>
			</nav>
		</div>
	</header>

	<div
		class="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10"
	>
		<!-- Sidebar with better spacing and visual hierarchy -->
		<aside
			class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block"
		>
			<ScrollArea class="h-full py-6 pr-6 lg:py-8">
				<div class="w-full pl-2">
					{#each docs as group, i}
						{#if i > 0}
							<Separator class="my-4" />
						{/if}
						<div class="pb-4">
							<h4
								class="mb-2 rounded-md px-2 py-1 text-sm font-semibold tracking-tight text-foreground/90"
							>
								{group.title}
							</h4>
							<div class="grid grid-flow-row auto-rows-max text-sm gap-1">
								{#each group.items as item}
									<a
										href={item.href}
										class="group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:bg-muted/50 hover:text-foreground text-muted-foreground transition-colors {$page
											.url.pathname === item.href
											? 'font-medium bg-muted text-primary'
											: ''}"
									>
										{#if item.icon}
											<item.icon class="mr-2 h-4 w-4" />
										{/if}
										{item.title}
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</ScrollArea>
		</aside>

		<main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_240px] px-2 md:px-0">
			<div class="mx-auto w-full min-w-0 max-w-3xl">
				{@render children?.()}
			</div>
			<!-- Right side table of contents -->
			<div class="hidden text-sm xl:block min-w-0">
				<div class="sticky top-20 pl-4 border-l">
					<p class="font-medium text-foreground mb-4">On this page</p>
					{#if headings.length > 0}
						<nav class="flex flex-col gap-2">
							{#each headings as heading}
								<a
									href="#{heading.id}"
									class="transition-colors line-clamp-1 block {heading.level === 3
										? 'pl-4'
										: ''} {activeId === heading.id
										? 'font-medium text-primary'
										: 'text-muted-foreground hover:text-foreground'}"
								>
									{heading.text}
								</a>
							{/each}
						</nav>
					{:else}
						<p class="text-muted-foreground text-xs">No sections found.</p>
					{/if}
				</div>
			</div>
		</main>
	</div>
</div>
