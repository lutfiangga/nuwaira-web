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
		ShieldCheck
	} from '@lucide/svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { page } from '$app/stores';

	import { enhance } from '$app/forms';

	let { data, children }: any = $props();
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
		ShieldCheck
	};

	const routes = $derived.by(() => {
		return (data?.panelMenu ?? []).map((item: any) => ({
			title: item.title,
			url: item.url,
			icon: iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
		}));
	});

	let breadcrumbs = $derived.by(() => {
		const path = $page.url.pathname;
		const segments = path.split('/').filter(Boolean);
		return segments.map((segment, index) => {
			const href = `/${segments.slice(0, index + 1).join('/')}`;
			const title = segment.charAt(0).toUpperCase() + segment.slice(1);
			return {
				title,
				href,
				isPage: index === segments.length - 1
			};
		});
	});
	// Image error state
	let imgError = $state(false);

	$effect(() => {
		// Reset error state when photo changes
		if (data?.user?.photo) {
			imgError = false;
		}
	});
</script>

<Sidebar.Provider>
	<!-- Sidebar -->
	<AppSidebar {routes} />

	<!-- Main content -->
	<main class="flex flex-col min-h-screen w-full">
		<!-- Header with User Dropdown -->
		<header class="flex items-center justify-between border-b px-4 py-3">
			<Sidebar.Trigger />

			<!-- User Dropdown -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
					{#if data?.user?.photo && !imgError}
						<img
							src={data.user.photo}
							alt="Profile"
							class="h-8 w-8 rounded-full object-cover"
							onerror={() => (imgError = true)}
						/>
					{:else}
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
							<User class="h-4 w-4" />
						</div>
					{/if}
					<div class="text-left">
						<p class="text-sm font-medium">{data?.user?.name || 'User'}</p>
						<p class="text-xs text-muted-foreground">@{data?.user?.username || 'user'}</p>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<a href="/panel/settings" class="flex items-center gap-2">
							<SettingsIcon class="h-4 w-4" />
							<span>Settings</span>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<form method="POST" action="/panel?/logout" use:enhance>
						<DropdownMenu.Item class="p-0">
							<button type="submit" class="flex w-full items-center px-2 py-1.5 gap-2">
								<LogOut class="h-4 w-4" />
								Logout
							</button>
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>

		<div class="px-4 sm:px-8">
			<Breadcrumb.Root class="my-2 sm:my-4">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/panel/dashboard">Application</Breadcrumb.Link>
					</Breadcrumb.Item>

					{#each breadcrumbs as crumb, i}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							{#if crumb.isPage}
								<Breadcrumb.Page>{crumb.title}</Breadcrumb.Page>
							{:else}
								<Breadcrumb.Link href={crumb.href}>{crumb.title}</Breadcrumb.Link>
							{/if}
						</Breadcrumb.Item>
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
