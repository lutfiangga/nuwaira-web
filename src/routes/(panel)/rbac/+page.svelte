<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Shield,
		Key,
		ShieldCheck,
		LayoutGrid,
		Route,
		Plus,
		Trash2,
		SquarePen,
		X
	} from '@lucide/svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedRoleId = $state('');
	let activeTab = $state('roles');

	$effect(() => {
		if (!selectedRoleId && data.roles.length > 0) {
			selectedRoleId = data.roles[0].id;
		}
	});

	const permissionOptions = $derived.by(() =>
		data.permissions.map((p) => ({ code: p.code, label: `${p.code} (${p.label})` }))
	);

	const resourceGroups = $derived.by(() =>
		data.permissions.reduce<Record<string, typeof data.permissions>>((acc, p) => {
			const key = p.resource;
			return { ...acc, [key]: [...(acc[key] ?? []), p] };
		}, {})
	);

	const selectedRolePermissions = $derived(
		new Set(data.rolePermissionMap[selectedRoleId] ?? [])
	);

	const isSuperadminRole = (rid: string) => rid === 'superadmin';
	const isSystemRole = (rid: string) => rid === 'superadmin' || rid === 'guest' || rid === 'authenticated';

	let showCreateRole = $state(false);
	let showCreatePermission = $state(false);
	let showCreateModule = $state(false);
	let showCreateRoute = $state(false);
	let editingRoleId = $state<string | null>(null);
	let editingPermCode = $state<string | null>(null);
	let editingModuleId = $state<string | null>(null);
	let editingRouteId = $state<string | null>(null);

	let dragIdx = $state<number | null>(null);
	let panelModuleItems = $state<typeof data.panelModules>([]);
	let reorderFormEl = $state<HTMLFormElement | null>(null);
	let reorderIdsInput = $state<HTMLInputElement | null>(null);

	$effect(() => {
		panelModuleItems = [...(data.panelModules ?? [])];
	});

	function handleDragStart(e: DragEvent, idx: number) {
		dragIdx = idx;
		e.dataTransfer!.effectAllowed = 'move';
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
	}

	function handleDrop(e: DragEvent, toIdx: number) {
		e.preventDefault();
		if (dragIdx === null || dragIdx === toIdx) { dragIdx = null; return; }
		const items = [...panelModuleItems];
		const [moved] = items.splice(dragIdx, 1);
		items.splice(toIdx, 0, moved);
		panelModuleItems = items;
		dragIdx = null;

		if (reorderIdsInput) {
			reorderIdsInput.value = JSON.stringify(items.map(m => m.id));
			reorderFormEl?.requestSubmit();
		}
	}

	function handleDragEnd() { dragIdx = null; }
</script>

<div class="mx-auto w-full space-y-6">

	{#if form?.message}
		<div class="rounded-xl border bg-muted/40 p-3 text-sm">{form.message}</div>
	{/if}

	<Tabs.Root bind:value={activeTab} class="w-full">
		<Tabs.List class="grid w-full grid-cols-5 rounded-xl bg-muted/50 p-1">
			<Tabs.Trigger value="roles" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
				<Shield class="mr-2 h-4 w-4" />
				Roles
			</Tabs.Trigger>
			<Tabs.Trigger value="permissions" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
				<Key class="mr-2 h-4 w-4" />
				Permissions
			</Tabs.Trigger>
			<Tabs.Trigger value="matrix" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
				<ShieldCheck class="mr-2 h-4 w-4" />
				Matrix
			</Tabs.Trigger>
			<Tabs.Trigger value="modules" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
				<LayoutGrid class="mr-2 h-4 w-4" />
				Panel Modules
			</Tabs.Trigger>
			<Tabs.Trigger value="routes" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
				<Route class="mr-2 h-4 w-4" />
				Routes
			</Tabs.Trigger>
		</Tabs.List>

		<!-- ========== ROLES TAB ========== -->
		<Tabs.Content value="roles" class="mt-6 space-y-6">
			<section class="rounded-2xl border bg-card p-4">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="font-semibold">Default Register Role</h2>
						<p class="text-sm text-muted-foreground">Role assigned to new registered users</p>
					</div>
				</div>
				<form method="POST" action="?/updateDefaultRole" class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
					<div class="grid gap-2 w-full sm:max-w-xs">
						<select name="defaultRoleId" class="h-10 rounded-md border bg-background px-3 text-sm">
							{#each data.roles as role}
								<option value={role.id} selected={role.id === data.defaultRegisterRoleId}>
									{role.name} ({role.id})
								</option>
							{/each}
						</select>
					</div>
					<Button type="submit" size="sm">Save</Button>
				</form>
			</section>

			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">All Roles</h2>
				<Button size="sm" onclick={() => (showCreateRole = true)}>
					<Plus class="mr-2 h-4 w-4" /> Add Role
				</Button>
			</div>

			{#if showCreateRole}
				<div class="rounded-2xl border bg-card p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-medium">New Role</h3>
						<Button variant="ghost" size="icon" onclick={() => (showCreateRole = false)}>
							<X class="h-4 w-4" />
						</Button>
					</div>
					<form method="POST" action="?/createRole" class="space-y-3">
						<div class="grid gap-3 sm:grid-cols-3">
							<div class="space-y-1">
								<Label for="newRoleId">Role ID</Label>
								<Input id="newRoleId" name="id" required placeholder="e.g. finance_ops" />
							</div>
							<div class="space-y-1">
								<Label for="newRoleName">Name</Label>
								<Input id="newRoleName" name="name" required placeholder="Role name" />
							</div>
							<div class="space-y-1">
								<Label for="newRoleDesc">Description</Label>
								<Input id="newRoleDesc" name="description" placeholder="Description" />
							</div>
						</div>
						<Button type="submit" size="sm">Create Role</Button>
					</form>
				</div>
			{/if}

			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.roles as role}
					<div class="rounded-2xl border bg-card p-4">
						<div class="flex items-start justify-between">
							<div class="space-y-1 flex-1">
								<div class="flex items-center gap-2">
									<h3 class="font-semibold">{role.name}</h3>
									<Badge variant="outline" class="text-xs">{role.id}</Badge>
								</div>
								{#if role.description}
									<p class="text-sm text-muted-foreground">{role.description}</p>
								{/if}
							</div>
							{#if !isSuperadminRole(role.id)}
								<div class="flex gap-1 ml-2">
									<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (editingRoleId = editingRoleId === role.id ? null : role.id)} title="Edit">
										<SquarePen class="h-4 w-4" />
									</Button>
									<form method="POST" action="?/deleteRole">
										<input type="hidden" name="id" value={role.id} />
										<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" type="submit" title="Delete">
											<Trash2 class="h-4 w-4" />
										</Button>
									</form>
								</div>
							{/if}
						</div>

						{#if editingRoleId === role.id}
							<form method="POST" action="?/updateRole" class="mt-3 space-y-3 border-t pt-3">
								<input type="hidden" name="id" value={role.id} />
								<div class="space-y-2">
									<Label>Name</Label>
									<Input name="name" required value={role.name} />
								</div>
								<div class="space-y-2">
									<Label>Description</Label>
									<Input name="description" value={role.description ?? ''} />
								</div>
								<div class="flex gap-2">
									<Button type="submit" size="sm">Save</Button>
									<Button type="button" variant="ghost" size="sm" onclick={() => (editingRoleId = null)}>Cancel</Button>
								</div>
							</form>
						{/if}
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<!-- ========== PERMISSIONS TAB ========== -->
		<Tabs.Content value="permissions" class="mt-6 space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-semibold">Permissions</h2>
					<p class="text-sm text-muted-foreground">Grouped by resource</p>
				</div>
				<Button size="sm" onclick={() => (showCreatePermission = true)}>
					<Plus class="mr-2 h-4 w-4" /> Add Permission
				</Button>
			</div>

			{#if showCreatePermission}
				<div class="rounded-2xl border bg-card p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-medium">New Permission</h3>
						<Button variant="ghost" size="icon" onclick={() => (showCreatePermission = false)}>
							<X class="h-4 w-4" />
						</Button>
					</div>
					<form method="POST" action="?/createPermission" class="space-y-3">
						<div class="grid gap-3 sm:grid-cols-3">
							<div class="space-y-1">
								<Label for="newPermCode">Code</Label>
								<Input id="newPermCode" name="code" required placeholder="users:create" />
							</div>
							<div class="space-y-1">
								<Label for="newPermResource">Resource</Label>
								<Input id="newPermResource" name="resource" required placeholder="users" />
							</div>
							<div class="space-y-1">
								<Label for="newPermAction">Action</Label>
								<Input id="newPermAction" name="action" required placeholder="create" />
							</div>
						</div>
						<div class="grid gap-3 sm:grid-cols-2">
							<div class="space-y-1">
								<Label for="newPermLabel">Label</Label>
								<Input id="newPermLabel" name="label" required placeholder="Users Create" />
							</div>
							<div class="space-y-1">
								<Label for="newPermDesc">Description</Label>
								<Input id="newPermDesc" name="description" placeholder="Description" />
							</div>
						</div>
						<Button type="submit" size="sm">Create Permission</Button>
					</form>
				</div>
			{/if}

			<div class="space-y-4">
				{#each Object.entries(resourceGroups) as [resource, permissions]}
					<div class="rounded-2xl border bg-card">
						<div class="flex items-center justify-between px-4 py-3 border-b">
							<h3 class="font-semibold capitalize">{resource.replaceAll('_', ' ')}</h3>
							<Badge variant="secondary">{permissions.length} permissions</Badge>
						</div>
						<div class="p-4 space-y-2">
							{#each permissions as perm}
								<div class="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
									<div class="flex items-center gap-3">
										<div>
											<p class="font-medium text-sm">{perm.label}</p>
											<p class="text-xs text-muted-foreground font-mono">{perm.code}</p>
										</div>
										<Badge variant="outline" class="text-xs">{perm.action}</Badge>
									</div>
									<div class="flex gap-1">
										<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (editingPermCode = editingPermCode === perm.code ? null : perm.code)} title="Edit">
											<SquarePen class="h-4 w-4" />
										</Button>
										<form method="POST" action="?/deletePermission">
											<input type="hidden" name="code" value={perm.code} />
											<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" type="submit" title="Delete">
												<Trash2 class="h-4 w-4" />
											</Button>
										</form>
									</div>
								</div>

								{#if editingPermCode === perm.code}
									<form method="POST" action="?/updatePermission" class="rounded-lg border p-3 space-y-3">
										<input type="hidden" name="code" value={perm.code} />
										<div class="grid gap-3 sm:grid-cols-4">
											<input name="resource" required value={perm.resource} class="h-9 rounded-md border bg-background px-3 text-sm" placeholder="resource" />
											<input name="action" required value={perm.action} class="h-9 rounded-md border bg-background px-3 text-sm" placeholder="action" />
											<input name="label" required value={perm.label} class="h-9 rounded-md border bg-background px-3 text-sm" placeholder="label" />
											<input name="description" value={perm.description ?? ''} class="h-9 rounded-md border bg-background px-3 text-sm" placeholder="description" />
										</div>
										<div class="flex gap-2">
											<Button type="submit" size="sm">Save</Button>
											<Button type="button" variant="ghost" size="sm" onclick={() => (editingPermCode = null)}>Cancel</Button>
										</div>
									</form>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<!-- ========== MATRIX TAB ========== -->
		<Tabs.Content value="matrix" class="mt-6 space-y-6">
			<div class="rounded-2xl border bg-card p-4">
				<div class="grid gap-2 sm:max-w-xs">
					<label for="matrixRole" class="text-sm font-medium">Select Role</label>
					<select id="matrixRole" class="h-10 rounded-md border bg-background px-3 text-sm" bind:value={selectedRoleId}>
						{#each data.roles as role}
							<option value={role.id}>{role.name} ({role.id})</option>
						{/each}
					</select>
				</div>
			</div>

			<form method="POST" action="?/updateRolePermissions">
				<input type="hidden" name="roleId" value={selectedRoleId} />
				<div class="space-y-4">
					{#each Object.entries(resourceGroups) as [resource, permissions]}
						<div class="rounded-2xl border bg-card">
							<div class="flex items-center justify-between px-4 py-3 border-b">
								<h3 class="font-semibold capitalize">{resource.replaceAll('_', ' ')}</h3>
								<div class="flex items-center gap-2">
									<label class="text-sm text-muted-foreground">
										<input type="checkbox" class="mr-1"
											checked={permissions.every(p => selectedRolePermissions.has(p.code))}
											onchange={(e) => {
												permissions.forEach(p => {
													const cb = document.querySelector(`input[name="permissionCodes"][value="${p.code}"]`) as HTMLInputElement;
													if (cb) cb.checked = (e.target as HTMLInputElement).checked;
												});
											}}
										/>
										All
									</label>
								</div>
							</div>
							<div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
								{#each permissions as perm}
									<label class="inline-flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-muted/30 cursor-pointer transition-colors">
										<input type="checkbox" name="permissionCodes" value={perm.code} checked={selectedRolePermissions.has(perm.code)} class="rounded" />
										<div>
											<span class="font-medium">{perm.label}</span>
											<span class="text-xs text-muted-foreground ml-1">({perm.action})</span>
										</div>
									</label>
								{/each}
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4">
					<Button type="submit">Save Permissions for Role</Button>
				</div>
			</form>
		</Tabs.Content>

		<!-- ========== PANEL MODULES TAB ========== -->
		<Tabs.Content value="modules" class="mt-6 space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-semibold">Panel Modules</h2>
					<p class="text-sm text-muted-foreground">Sidebar menu items</p>
				</div>
				<Button size="sm" onclick={() => (showCreateModule = true)}>
					<Plus class="mr-2 h-4 w-4" /> Add Module
				</Button>
			</div>

			{#if showCreateModule}
				<div class="rounded-2xl border bg-card p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-medium">New Panel Module</h3>
						<Button variant="ghost" size="icon" onclick={() => (showCreateModule = false)}>
							<X class="h-4 w-4" />
						</Button>
					</div>
					<form method="POST" action="?/createPanelModule" class="space-y-3">
						<div class="grid gap-3 sm:grid-cols-4">
							<div class="space-y-1">
								<Label for="newModKey">Module Key</Label>
								<Input id="newModKey" name="moduleKey" required placeholder="users" />
							</div>
							<div class="space-y-1">
								<Label for="newModTitle">Title</Label>
								<Input id="newModTitle" name="title" required placeholder="Users" />
							</div>
							<div class="space-y-1">
								<Label for="newModUrl">URL</Label>
								<Input id="newModUrl" name="url" required placeholder="/users" />
							</div>
							<div class="space-y-1">
								<Label for="newModIcon">Icon</Label>
								<Input id="newModIcon" name="icon" placeholder="Users" value="LayoutDashboard" />
							</div>
						</div>
						<div class="grid gap-3 sm:grid-cols-4">
							<div class="space-y-1">
								<Label for="newModPerm">Permission</Label>
								<select id="newModPerm" name="menuPermissionCode" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
									<option value="">None</option>
									{#each permissionOptions as opt}
										<option value={opt.code}>{opt.label}</option>
									{/each}
								</select>
							</div>
							<div class="space-y-1">
								<Label for="newModSort">Sort Order</Label>
								<Input id="newModSort" name="sortOrder" type="number" value="0" />
							</div>
							<div class="space-y-1">
								<Label for="newModVis">Visible</Label>
								<select id="newModVis" name="isVisible" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
									<option value="true">Visible</option>
									<option value="false">Hidden</option>
								</select>
							</div>
							<div class="space-y-1">
								<Label for="newModActive">Active</Label>
								<select id="newModActive" name="isActive" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
									<option value="true">Active</option>
									<option value="false">Inactive</option>
								</select>
							</div>
						</div>
						<div class="space-y-1">
							<Label for="newModDesc">Description</Label>
							<Input id="newModDesc" name="description" placeholder="Description" />
						</div>
						<Button type="submit" size="sm">Create Module</Button>
					</form>
				</div>
			{/if}

			<form bind:this={reorderFormEl} method="POST" action="?/reorderPanelModules" class="hidden">
				<input type="hidden" name="ids" bind:this={reorderIdsInput} />
			</form>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Panel modules">
				{#each panelModuleItems as module, idx}
					<div
						class="rounded-2xl border bg-card p-4 space-y-3 transition-all cursor-grab active:cursor-grabbing"
						draggable="true"
						role="listitem"
						ondragstart={(e) => handleDragStart(e, idx)}
						ondragover={handleDragOver}
						ondrop={(e) => handleDrop(e, idx)}
						ondragend={handleDragEnd}
					>
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<h3 class="font-semibold">{module.title}</h3>
								<p class="text-xs font-mono text-muted-foreground">{module.url}</p>
							</div>
							<div class="flex gap-1">
								<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (editingModuleId = editingModuleId === module.id ? null : module.id)} title="Edit">
									<SquarePen class="h-4 w-4" />
								</Button>
								<form method="POST" action="?/deletePanelModule">
									<input type="hidden" name="id" value={module.id} />
									<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" type="submit" title="Delete">
										<Trash2 class="h-4 w-4" />
									</Button>
								</form>
							</div>
						</div>

						<div class="flex flex-wrap gap-1">
							<Badge variant="outline" class="text-xs">{module.icon}</Badge>
							<Badge variant="outline" class="text-xs">#{module.sortOrder}</Badge>
							<Badge variant={module.isVisible ? 'secondary' : 'outline'} class="text-xs">{module.isVisible ? 'Visible' : 'Hidden'}</Badge>
							<Badge variant={module.isActive ? 'default' : 'destructive'} class="text-xs">{module.isActive ? 'Active' : 'Inactive'}</Badge>
						</div>

						{#if module.description}
							<p class="text-sm text-muted-foreground">{module.description}</p>
						{/if}

						{#if editingModuleId === module.id}
							<form method="POST" action="?/updatePanelModule" class="space-y-3 border-t pt-3">
								<input type="hidden" name="id" value={module.id} />
								<div class="grid gap-2 sm:grid-cols-2">
									<div class="space-y-1">
										<Label>Module Key</Label>
										<Input name="moduleKey" required value={module.moduleKey} />
									</div>
									<div class="space-y-1">
										<Label>Title</Label>
										<Input name="title" required value={module.title} />
									</div>
									<div class="space-y-1">
										<Label>URL</Label>
										<Input name="url" required value={module.url} />
									</div>
									<div class="space-y-1">
										<Label>Icon</Label>
										<Input name="icon" value={module.icon} />
									</div>
									<div class="space-y-1">
										<Label>Permission</Label>
										<select name="menuPermissionCode" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
											<option value="">None</option>
											{#each permissionOptions as opt}
												<option value={opt.code} selected={module.menuPermissionCode === opt.code}>{opt.label}</option>
											{/each}
										</select>
									</div>
									<div class="space-y-1">
										<Label>Sort</Label>
										<Input name="sortOrder" type="number" value={module.sortOrder} />
									</div>
									<div class="space-y-1">
										<Label>Visible</Label>
										<select name="isVisible" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
											<option value="true" selected={module.isVisible}>Visible</option>
											<option value="false" selected={!module.isVisible}>Hidden</option>
										</select>
									</div>
									<div class="space-y-1">
										<Label>Active</Label>
										<select name="isActive" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
											<option value="true" selected={module.isActive}>Active</option>
											<option value="false" selected={!module.isActive}>Inactive</option>
										</select>
									</div>
								</div>
								<div class="space-y-1">
									<Label>Description</Label>
									<Input name="description" value={module.description ?? ''} />
								</div>
								<div class="flex gap-2">
									<Button type="submit" size="sm">Save</Button>
									<Button type="button" variant="ghost" size="sm" onclick={() => (editingModuleId = null)}>Cancel</Button>
								</div>
							</form>
						{/if}
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<!-- ========== ROUTES TAB ========== -->
		<Tabs.Content value="routes" class="mt-6 space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-semibold">Route Permissions</h2>
					<p class="text-sm text-muted-foreground">Map routes to permission codes</p>
				</div>
				<Button size="sm" onclick={() => (showCreateRoute = true)}>
					<Plus class="mr-2 h-4 w-4" /> Add Route
				</Button>
			</div>

			{#if showCreateRoute}
				<div class="rounded-2xl border bg-card p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-medium">New Route Mapping</h3>
						<Button variant="ghost" size="icon" onclick={() => (showCreateRoute = false)}>
							<X class="h-4 w-4" />
						</Button>
					</div>
					<form method="POST" action="?/createRoutePermission" class="space-y-3">
						<div class="grid gap-3 sm:grid-cols-3">
							<div class="space-y-1">
								<Label for="newRouteKey">Route Key</Label>
								<Input id="newRouteKey" name="routeKey" required placeholder="users" />
							</div>
							<div class="space-y-1">
								<Label for="newRouteOp">Operation</Label>
								<Input id="newRouteOp" name="operationKey" required placeholder="read" />
							</div>
							<div class="space-y-1">
								<Label for="newRoutePath">Path</Label>
								<Input id="newRoutePath" name="routePath" placeholder="/users" />
							</div>
						</div>
						<div class="grid gap-3 sm:grid-cols-3">
							<div class="space-y-1">
								<Label for="newRouteMethod">Method</Label>
								<Input id="newRouteMethod" name="method" placeholder="GET/POST" />
							</div>
							<div class="space-y-1">
								<Label for="newRoutePerm">Permission</Label>
								<select id="newRoutePerm" name="permissionCode" required class="h-10 rounded-md border bg-background px-3 text-sm w-full">
									{#each permissionOptions as opt}
										<option value={opt.code}>{opt.label}</option>
									{/each}
								</select>
							</div>
							<div class="space-y-1">
								<Label for="newRouteActive">Status</Label>
								<select id="newRouteActive" name="isActive" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
									<option value="true">Active</option>
									<option value="false">Inactive</option>
								</select>
							</div>
						</div>
						<div class="space-y-1">
							<Label for="newRouteDesc">Description</Label>
							<Input id="newRouteDesc" name="description" placeholder="Description" />
						</div>
						<Button type="submit" size="sm">Create Mapping</Button>
					</form>
				</div>
			{/if}

			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.routePermissions as entry}
					<div class="rounded-2xl border bg-card p-4 space-y-2">
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<h3 class="font-semibold font-mono text-sm">{entry.routeKey}:{entry.operationKey}</h3>
								<p class="text-xs text-muted-foreground">{entry.permissionCode}</p>
							</div>
							<div class="flex gap-1">
								<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (editingRouteId = editingRouteId === entry.id ? null : entry.id)} title="Edit">
									<SquarePen class="h-4 w-4" />
								</Button>
								<form method="POST" action="?/deleteRoutePermission">
									<input type="hidden" name="id" value={entry.id} />
									<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" type="submit" title="Delete">
										<Trash2 class="h-4 w-4" />
									</Button>
								</form>
							</div>
						</div>

						<div class="flex flex-wrap gap-1">
							{#if entry.routePath}<Badge variant="outline" class="text-xs font-mono">{entry.routePath}</Badge>{/if}
							{#if entry.method}<Badge variant="outline" class="text-xs">{entry.method}</Badge>{/if}
							<Badge variant={entry.isActive ? 'default' : 'destructive'} class="text-xs">{entry.isActive ? 'Active' : 'Inactive'}</Badge>
						</div>

						{#if entry.description}
							<p class="text-sm text-muted-foreground">{entry.description}</p>
						{/if}

						{#if editingRouteId === entry.id}
							<form method="POST" action="?/updateRoutePermission" class="space-y-3 border-t pt-3">
								<input type="hidden" name="id" value={entry.id} />
								<div class="grid gap-2 sm:grid-cols-3">
									<div class="space-y-1">
										<Label>Route Key</Label>
										<Input name="routeKey" required value={entry.routeKey} />
									</div>
									<div class="space-y-1">
										<Label>Operation</Label>
										<Input name="operationKey" required value={entry.operationKey} />
									</div>
									<div class="space-y-1">
										<Label>Path</Label>
										<Input name="routePath" value={entry.routePath ?? ''} />
									</div>
								</div>
								<div class="grid gap-2 sm:grid-cols-3">
									<div class="space-y-1">
										<Label>Method</Label>
										<Input name="method" value={entry.method ?? ''} />
									</div>
									<div class="space-y-1">
										<Label>Permission</Label>
										<select name="permissionCode" required class="h-10 rounded-md border bg-background px-3 text-sm w-full">
											{#each permissionOptions as opt}
												<option value={opt.code} selected={entry.permissionCode === opt.code}>{opt.label}</option>
											{/each}
										</select>
									</div>
									<div class="space-y-1">
										<Label>Status</Label>
										<select name="isActive" class="h-10 rounded-md border bg-background px-3 text-sm w-full">
											<option value="true" selected={entry.isActive}>Active</option>
											<option value="false" selected={!entry.isActive}>Inactive</option>
										</select>
									</div>
								</div>
								<div class="space-y-1">
									<Label>Description</Label>
									<Input name="description" value={entry.description ?? ''} />
								</div>
								<div class="flex gap-2">
									<Button type="submit" size="sm">Save</Button>
									<Button type="button" variant="ghost" size="sm" onclick={() => (editingRouteId = null)}>Cancel</Button>
								</div>
							</form>
						{/if}
					</div>
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
