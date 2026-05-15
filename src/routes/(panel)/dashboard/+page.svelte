<script lang="ts">
	import type { PageServerData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { Users, User, FolderOpen, ChartColumnStacked, MapPinned, Package, Sparkles } from '@lucide/svelte';
	import ModuleCard from '$lib/components/dashboard/module-card.svelte';
	import TableCard from '$lib/components/dashboard/table-card.svelte';
	import StatusBadge from '$lib/components/dashboard/status-badge.svelte';

	let { data }: { data: PageServerData } = $props();

	type ModuleStat = {
		key: string;
		label: string;
		href: string;
		value: number;
	};

	type HealthCard = {
		key: string;
		label: string;
		value: number;
	};

	type DashboardUser = {
		id: string;
		username: string;
		email: string;
		roleId: string;
		name: string | null;
	};

	type DashboardStudent = {
		id: string;
		studentCode: string;
		fullName: string;
		status: string;
		track: string;
	};

	type DashboardEnrollment = {
		id: string;
		studentName: string | null;
		classTitle: string | null;
		status: string;
		paymentStatus: string;
	};

	const moduleIconMap = {
		users: Users,
		students: User,
		classes: ChartColumnStacked,
		enrollments: MapPinned,
		materials: FolderOpen
	} as const;

	const firstName = $derived.by(() =>
		(data.user.name || data.user.username || 'User').split(/\s+/)[0]
	);

	const moduleStats = $derived((data.moduleStats ?? []) as ModuleStat[]);
	const healthCards = $derived((data.healthCards ?? []) as HealthCard[]);
	const recentUsers = $derived((data.recentUsers ?? []) as DashboardUser[]);
	const recentStudents = $derived((data.recentStudents ?? []) as DashboardStudent[]);
	const recentEnrollments = $derived((data.recentEnrollments ?? []) as DashboardEnrollment[]);

	const healthColors = ['bg-primary/10 border-primary/20', 'bg-emerald-50 border-emerald-200', 'bg-sky-50 border-sky-200', 'bg-amber-50 border-amber-200'];
</script>

<div class="space-y-6">
	<section class="rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-indigo-50/30 border border-primary/10 p-6 md:p-8">
		<div class="flex items-center gap-3">
			<div class="rounded-xl bg-primary p-2.5 text-primary-foreground">
				<Sparkles class="h-5 w-5" />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight">Hi, {firstName}!</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					Ringkasan module pakai card. Data operasional pakai tabel supaya scan cepat.
				</p>
			</div>
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
		{#each moduleStats as item}
			{@const iconComponent = moduleIconMap[item.key as keyof typeof moduleIconMap] || Package}
			<ModuleCard Icon={iconComponent} label={item.label} value={item.value} href={item.href} />
		{/each}
	</section>

	<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each healthCards as item, i}
			<article class="rounded-2xl border-l-4 {healthColors[i % healthColors.length]} bg-card p-5 transition-all hover:shadow-sm">
				<p class="text-sm font-medium text-muted-foreground">{item.label}</p>
				<p class="mt-2 text-2xl font-bold">{item.value}</p>
			</article>
		{/each}
	</section>

	<section class="grid gap-6 xl:grid-cols-2">
		<TableCard
			title="Recent Students"
			subtitle="Detail list cocok pakai tabel"
			viewAllHref="/students"
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Student Code</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Track</Table.Head>
						<Table.Head>Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each recentStudents as item}
						<Table.Row>
							<Table.Cell class="font-medium">{item.studentCode}</Table.Cell>
							<Table.Cell>{item.fullName}</Table.Cell>
							<Table.Cell class="capitalize">{item.track}</Table.Cell>
							<Table.Cell>
								<StatusBadge status={item.status} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</TableCard>

		<TableCard
			title="Recent Enrollments"
			subtitle="Status flow enrollment & payment"
			viewAllHref="/enrollments"
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Student</Table.Head>
						<Table.Head>Class</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Payment</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each recentEnrollments as item}
						<Table.Row>
							<Table.Cell class="font-medium">{item.studentName || '-'}</Table.Cell>
							<Table.Cell>{item.classTitle || '-'}</Table.Cell>
							<Table.Cell>
								<StatusBadge status={item.status} />
							</Table.Cell>
							<Table.Cell>
								<StatusBadge status={item.paymentStatus} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</TableCard>
	</section>

	<TableCard
		title="Users Overview"
		subtitle="Untuk manajemen penuh tetap gunakan halaman DataTable users"
		viewAllHref="/users"
		viewAllLabel="Manage Users"
	>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Username</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Role</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each recentUsers as item}
					<Table.Row>
						<Table.Cell class="font-medium">{item.username}</Table.Cell>
						<Table.Cell>{item.name || '-'}</Table.Cell>
						<Table.Cell>{item.email}</Table.Cell>
						<Table.Cell class="uppercase text-muted-foreground">{item.roleId}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</TableCard>
</div>
