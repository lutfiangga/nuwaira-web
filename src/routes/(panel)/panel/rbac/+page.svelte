<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedRoleId = $state('');

	$effect(() => {
		if (!selectedRoleId && data.roles.length > 0) {
			selectedRoleId = data.roles[0].id;
		}
	});

	const permissionsByResource = $derived.by(() => {
		return data.permissions.reduce<Record<string, typeof data.permissions>>((acc, permission) => {
			const resourcePermissions = acc[permission.resource] ?? [];
			return {
				...acc,
				[permission.resource]: [...resourcePermissions, permission]
			};
		}, {});
	});

	const selectedRolePermissions = $derived(
		new Set(data.rolePermissionMap[selectedRoleId] ?? [])
	);
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold">RBAC Settings</h1>
		<p class="text-muted-foreground mt-1">Set default role for register, menu access, and CRUD permissions.</p>
	</div>

	{#if form?.message}
		<div class="rounded-md border border-border bg-muted/40 p-3 text-sm">{form.message}</div>
	{/if}

	<section class="rounded-lg border p-4 space-y-4">
		<h2 class="text-xl font-semibold">Default Register Role</h2>
		<form method="POST" action="?/updateDefaultRole" class="flex flex-col gap-3 sm:flex-row sm:items-end">
			<div class="grid gap-2 w-full sm:max-w-xs">
				<label for="defaultRoleId" class="text-sm font-medium">Role</label>
				<select
					id="defaultRoleId"
					name="defaultRoleId"
					class="h-10 rounded-md border bg-background px-3 text-sm"
				>
					{#each data.roles as role}
						<option value={role.id} selected={role.id === data.defaultRegisterRoleId}>
							{role.name}
						</option>
					{/each}
				</select>
			</div>
			<Button type="submit">Save Default Role</Button>
		</form>
	</section>

	<section class="rounded-lg border p-4 space-y-4">
		<h2 class="text-xl font-semibold">Role Permission Matrix</h2>

		<div class="grid gap-2 sm:max-w-xs">
			<label for="role-selector" class="text-sm font-medium">Select Role</label>
			<select
				id="role-selector"
				class="h-10 rounded-md border bg-background px-3 text-sm"
				bind:value={selectedRoleId}
			>
				{#each data.roles as role}
					<option value={role.id}>{role.name}</option>
				{/each}
			</select>
		</div>

		<form method="POST" action="?/updateRolePermissions" class="space-y-4">
			<input type="hidden" name="roleId" value={selectedRoleId} />

			<div class="space-y-6">
				{#each Object.entries(permissionsByResource) as [resource, permissions]}
					<div class="rounded-md border p-3">
						<h3 class="font-medium capitalize">{resource.replace('_', ' ')}</h3>
						<div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
							{#each permissions as permission}
								<label class="inline-flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										name="permissionCodes"
										value={permission.code}
										checked={selectedRolePermissions.has(permission.code)}
									/>
									<span>{permission.action}</span>
								</label>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<Button type="submit">Save Permissions</Button>
		</form>
	</section>
</div>
