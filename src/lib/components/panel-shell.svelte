<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		ChevronDown,
		CalendarCheck,
		CalendarDays,
		ClipboardList,
		FolderKanban,
		GraduationCap,
		Layers,
		LayoutDashboard,
		LogOut,
		MessageCircleQuestion,
		Share2,
		User,
		UserCircle,
		UserRoundPlus,
		Users,
		Target,
		FilePen,
		BarChart3,
		Tag,
		UserCheck
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type PanelRole = 'admin' | 'student';
	type PanelData = {
		panelRole?: PanelRole;
		user?: {
			role?: string;
			name?: string | null;
			email?: string | null;
		};
	};

	let { data, children }: { data: PanelData; children: Snippet } = $props();

	const adminRouteGroups = [
		{
			title: 'Dashboard',
			routes: [{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }]
		},

		{
			title: 'Master Data',
			routes: [
				{
					title: 'Programs',
					icon: FolderKanban,
					children: [
						{ title: 'Program', url: '/programs', icon: FolderKanban },
						{ title: 'Milestone', url: '/milestones', icon: Layers },
						{ title: 'Intro', url: '/intros', icon: Target },
						{ title: 'Metric', url: '/metrics', icon: BarChart3 },
						{ title: 'Offering', url: '/offerings', icon: Tag },
						{ title: 'Batch', url: '/batches', icon: CalendarCheck }
					]
				},
				{
					title: 'Users & student',
					icon: Users,
					children: [
						{ title: 'Calon Siswa', url: '/prospective-students', icon: UserRoundPlus },
						{ title: 'Siswa', url: '/students', icon: GraduationCap },
						{ title: 'Users', url: '/users', icon: Users }
					]
				},
				{
					title: 'General',
					icon: FilePen,
					children: [
						{ title: 'FAQ', url: '/faqs', icon: MessageCircleQuestion },
						{ title: 'Social Media', url: '/social-media', icon: Share2 }
					]
				},
				{ title: 'Events', url: '/events', icon: CalendarDays }
			]
		},
		{
			title: 'Transaction',
			routes: [
				{ title: 'Enrollment', url: '/enrollments', icon: ClipboardList },
				{ title: 'Attendance', url: '/attendance', icon: CalendarCheck }
			]
		}
	];

	const studentRoutes = [
		{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
		{ title: 'Attendance', url: '/attendance', icon: CalendarCheck },
		{ title: 'Profil', url: '/profile', icon: UserCircle }
	] as const;

	const normalizeRoute = (url: string) =>
		url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;

	const panelRole = $derived<PanelRole>(
		data?.panelRole === 'admin' || data?.user?.role === 'admin' ? 'admin' : 'student'
	);
	const routeGroups = $derived(panelRole === 'admin' ? adminRouteGroups : []);
	const currentPath = $derived(normalizeRoute($page.url.pathname));
	const user = $derived(data?.user);
	const displayName = $derived(user?.name || user?.email || 'User');
	const displayEmail = $derived(user?.email || '');
	const pageTitle = $derived.by(() => {
		for (const group of routeGroups) {
			for (const route of group.routes) {
				if ('children' in route && route.children) {
					const matched = route.children?.find((r) => normalizeRoute(r.url) === currentPath);
					if (matched) return matched.title;
				} else if ('url' in route) {
					if (normalizeRoute(route.url as string) === currentPath) return route.title;
				}
			}
		}
		const fallback = currentPath.split('/').filter(Boolean).at(-1) ?? 'dashboard';
		return `${fallback.charAt(0).toUpperCase()}${fallback.slice(1)}`;
	});
</script>

<Sidebar.Provider class="font-plus-jakarta bg-slate-100">
	<AppSidebar groups={routeGroups} />

	<main class="flex min-h-screen w-full flex-col p-2 md:p-4">
		<section class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-white">
			<header class="flex items-center gap-3 border-b bg-white px-4 py-3 md:px-5">
				<Sidebar.Trigger class="md:hidden" />

				<div class="min-w-0 flex-1">
					<h1 class="mt-1 truncate text-lg font-semibold text-slate-950 md:text-xl">{pageTitle}</h1>
				</div>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="flex items-center gap-2 rounded-md border bg-white p-1.5 pr-2 text-left hover:bg-slate-50"
					>
						<div
							class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700"
						>
							<User class="h-4 w-4" />
						</div>
						<div class="hidden min-w-0 sm:block">
							<p class="max-w-40 truncate text-sm font-medium text-slate-900">{displayName}</p>
							<p class="max-w-40 truncate text-xs text-slate-500">{displayEmail}</p>
						</div>
						<ChevronDown class="h-4 w-4 text-slate-500" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-56">
						<DropdownMenu.Label>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium">{displayName}</p>
								<p class="truncate text-xs text-muted-foreground">{displayEmail}</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<a href={resolve('/logout')} class="flex items-center gap-2">
								<LogOut class="h-4 w-4" />
								<span>Logout</span>
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</header>

			<div class="min-h-0 flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
				{@render children?.()}
			</div>
		</section>
	</main>
</Sidebar.Provider>
