<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { User, Lock, UserCircle } from '@lucide/svelte';

	let { data, form } = $props();

	let photoPreview = $state<string | null>(data.currentUser?.photo || null);
	let photoFile = $state<File | null>(null);

	function handlePhotoChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			photoFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				photoPreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	// Image error state
	let imgError = $state(false);

	$effect(() => {
		// Reset error state when photo changes
		if (data?.user?.photo) {
			imgError = false;
		}
	});
</script>

<div class="mx-auto w-full">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Settings</h1>
		<p class="text-muted-foreground">Manage your account settings and preferences</p>
	</div>

	<Tabs.Root value="profile" class="w-full">
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="profile">
				<UserCircle class="mr-2 h-4 w-4" />
				Profile
			</Tabs.Trigger>
			<Tabs.Trigger value="security">
				<Lock class="mr-2 h-4 w-4" />
				Security
			</Tabs.Trigger>
			<Tabs.Trigger value="account">
				<User class="mr-2 h-4 w-4" />
				Account
			</Tabs.Trigger>
		</Tabs.List>

		<!-- Profile Tab -->
		<Tabs.Content value="profile" class="mt-6">
			<form
				method="POST"
				action="?/updateProfile"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false });
					};
				}}
			>
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium">Profile Information</h3>
						<p class="text-sm text-muted-foreground">
							Update your profile photo and personal details
						</p>
					</div>

					<Separator />
					{#if form?.message}
						<div
							class="rounded-md border p-3 {form.success
								? 'border-green-500 bg-green-50 text-green-800'
								: 'border-red-500 bg-red-50 text-red-800'}"
						>
							{form.message}
						</div>
					{/if}

					<!-- Photo Upload -->
					<div class="flex items-center gap-6">
						<div class="relative">
							{#if photoPreview && !imgError}
								<img
									src={photoPreview}
									alt="Profile"
									class="h-24 w-24 rounded-full object-cover"
									onerror={() => (imgError = true)}
								/>
							{:else}
								<div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
									<User class="h-12 w-12 text-muted-foreground" />
								</div>
							{/if}
						</div>
						<div class="flex-1">
							<Label for="photo">Profile Photo</Label>
							<Input
								id="photo"
								name="photo"
								type="file"
								accept="image/*"
								onchange={handlePhotoChange}
								class="mt-2"
							/>
							<input type="hidden" name="photo_path" value="uploads/users" />
							<p class="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
						</div>
					</div>

					<!-- Name -->
					<div class="space-y-2">
						<Label for="name">Full Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							value={data.currentUser?.name || ''}
							placeholder="Enter your full name"
						/>
					</div>

					<!-- Email -->
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={data.currentUser?.email || ''}
							placeholder="your.email@example.com"
						/>
					</div>

					<!-- Age -->
					<div class="space-y-2">
						<Label for="age">Age</Label>
						<Input
							id="age"
							name="age"
							type="number"
							value={data.currentUser?.age || ''}
							placeholder="Enter your age"
						/>
					</div>

					<Button type="submit" class="w-full">Save Changes</Button>
				</div>
			</form>
		</Tabs.Content>

		<!-- Security Tab -->
		<Tabs.Content value="security" class="mt-6">
			<form method="POST" action="?/changePassword" use:enhance>
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium">Change Password</h3>
						<p class="text-sm text-muted-foreground">
							Update your password to keep your account secure
						</p>
					</div>

					<Separator />
					{#if form?.message}
						<div
							class="rounded-md border p-3 {form.success
								? 'border-green-500 bg-green-50 text-green-800'
								: 'border-red-500 bg-red-50 text-red-800'}"
						>
							{form.message}
						</div>
					{/if}

					<div class="space-y-2">
						<Label for="currentPassword">Current Password</Label>
						<Input
							id="currentPassword"
							name="currentPassword"
							type="password"
							placeholder="Enter current password"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="newPassword">New Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type="password"
							placeholder="Enter new password"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="confirmPassword">Confirm New Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="Confirm new password"
							required
						/>
					</div>

					<Button type="submit" class="w-full">Change Password</Button>
				</div>
			</form>
		</Tabs.Content>

		<!-- Account Tab -->
		<Tabs.Content value="account" class="mt-6">
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-medium">Account Information</h3>
					<p class="text-sm text-muted-foreground">View your account details</p>
				</div>

				<Separator />

				<div class="space-y-4">
					<div>
						<Label class="text-muted-foreground">Username</Label>
						<p class="mt-1 font-medium">{data.currentUser?.username || 'N/A'}</p>
					</div>

					<div>
						<Label class="text-muted-foreground">User ID</Label>
						<p class="mt-1 font-mono text-sm">{data.currentUser?.id || 'N/A'}</p>
					</div>

					<div>
						<Label class="text-muted-foreground">Email</Label>
						<p class="mt-1 font-medium">{data.currentUser?.email || 'N/A'}</p>
					</div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
