<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';

	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';

	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let showRegister = $state(false);
</script>

<main class="min-h-screen flex items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<!-- LOGIN CARD -->
		{#if !showRegister}
			<div class="space-y-4">
				<Card.Header>
					<Card.Title>Login</Card.Title>
					<Card.Description>Masukkan username & password Anda</Card.Description>
					<Card.Action>
						<Button
							variant="link"
							class="cursor-pointer"
							onclick={() => (showRegister = !showRegister)}>Belum punya akun?</Button
						>
					</Card.Action>
				</Card.Header>

				<Card.Content>
					{#if form?.message}
						<Alert.Root variant="destructive" class="my-2">
							<CircleAlertIcon class="size-4" />

							<Alert.Title>Error</Alert.Title>

							<Alert.Description>{form.message}</Alert.Description>
						</Alert.Root>
					{/if}

					<form method="post" action="?/login" use:enhance>
						<div class="flex flex-col gap-6">
							<div class="grid gap-2">
								<Label for="login-username">Username</Label>
								<Input
									id="login-username"
									name="username"
									type="text"
									placeholder="johndoe"
									required
								/>
							</div>

							<div class="grid gap-2">
								<Label for="login-password">Password</Label>
								<Input id="login-password" name="password" type="password" required />
							</div>

							<Button type="submit" class="w-full cursor-pointer">Login</Button>
						</div>
					</form>
				</Card.Content>

				<Card.Footer>
					<Button
						variant="secondary"
						class="w-full cursor-pointer"
						onclick={() => (showRegister = !showRegister)}>Daftar akun</Button
					>
				</Card.Footer>
			</div>
		{/if}

		<!-- REGISTER CARD -->
		{#if showRegister}
			<div class="space-y-4">
				<Card.Header>
					<Card.Title>Buat Akun Baru</Card.Title>
					<Card.Description>Daftarkan username & password</Card.Description>
					<Card.Action>
						<Button variant="link" class="cursor-pointer" onclick={() => (showRegister = !showRegister)}
							>Sudah punya akun?</Button
						>
					</Card.Action>
				</Card.Header>

				<Card.Content>
					{#if form?.message}
						<Alert.Root variant="destructive" class="my-2">
							<CircleAlertIcon class="size-4" />

							<Alert.Title>Error</Alert.Title>

							<Alert.Description>{form.message}</Alert.Description>
						</Alert.Root>
					{/if}
					<form method="post" action="?/register" use:enhance>
						<div class="flex flex-col gap-6">
							<div class="grid gap-2">
								<Label for="reg-username">Username</Label>
								<Input
									id="reg-username"
									name="username"
									type="text"
									placeholder="johndoe"
									required
								/>
							</div>

							<div class="grid gap-2">
								<Label for="reg-password">Password</Label>
								<Input id="reg-password" name="password" type="password" required />
							</div>

							<Button type="submit" class="w-full cursor-pointer">Register</Button>
						</div>
					</form>
				</Card.Content>

				<Card.Footer>
					<Button
						variant="secondary"
						class="w-full cursor-pointer"
						onclick={() => (showRegister = !showRegister)}>Kembali ke Login</Button
					>
				</Card.Footer>
			</div>
		{/if}
	</Card.Root>
</main>
