<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Share2, Trash2, Instagram, Youtube, Facebook, Linkedin, Twitter, Github, Twitch, Send, Globe, MessageCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';
	import type { Component } from 'svelte';

	type SocialLinkItem = {
		platform: string;
		url: string;
		iconKey: string;
	};

	let {
		data,
		form
	}: {
		data: { links: (SocialLinkItem & { id: string })[] };
		form?: Record<string, unknown> | null;
	} = $props();

	const socialIcons: { value: string; label: string; icon: Component<{ class?: string }> }[] = [
		{ value: 'Instagram', label: 'Instagram', icon: Instagram },
		{ value: 'Youtube', label: 'YouTube', icon: Youtube },
		{ value: 'Facebook', label: 'Facebook', icon: Facebook },
		{ value: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
		{ value: 'Twitter', label: 'Twitter / X', icon: Twitter },
		{ value: 'Github', label: 'GitHub', icon: Github },
		{ value: 'Twitch', label: 'Twitch', icon: Twitch },
		{ value: 'Send', label: 'Telegram', icon: Send },
		{ value: 'Globe', label: 'Website', icon: Globe },
		{ value: 'MessageCircle', label: 'WhatsApp / Chat', icon: MessageCircle }
	];

	const iconOptions = socialIcons.map((i) => ({ value: i.value, label: i.label }));
	const iconMap: Record<string, Component<{ class?: string }>> = Object.fromEntries(
		socialIcons.map((i) => [i.value, i.icon])
	);

	let links = $state<SocialLinkItem[]>([]);
	let saving = $state(false);
	let saveMessage = $state('');
	let saveError = $state('');
	let validationErrors = $state<Record<number, Record<string, string>>>({});
	let restoredForm: Record<string, unknown> | null | undefined;

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		saving = false;
		validationErrors = {};

		if (form?.success) {
			saveMessage = (form.message as string) ?? 'Berhasil disimpan';
			saveError = '';
		} else if (form?.message && !form?.success) {
			saveError = form.message as string;
			saveMessage = '';
			validationErrors = (form.linkErrors as Record<number, Record<string, string>>) ?? {};
		}
	});

	$effect(() => {
		if (data.links) {
			links = data.links.map((l) => ({
				platform: l.platform,
				url: l.url,
				iconKey: l.iconKey
			}));
		} else {
			links = [];
		}
	});

	function addLink() {
		links = [...links, { platform: '', url: '', iconKey: '' }];
	}

	function removeLink(index: number) {
		links = links.filter((_, i) => i !== index);
	}

	function handleIconSelect(index: number, value: string) {
		links = links.map((link, i) => (i === index ? { ...link, iconKey: value } : link));
	}
</script>

<svelte:head>
	<title>Social Media | Admin Nuwaira</title>
</svelte:head>

{#snippet renderIcon(key: string, size: string)}
	{#if iconMap[key]}
		{@const Icon = iconMap[key]}
		<Icon class={size} />
	{/if}
{/snippet}

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<Share2 class="size-5" /> Social Media
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">
				Kelola Social Media
			</h2>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<form method="post" action="?/save" use:enhance={({ formData }) => {
			formData.set('links', JSON.stringify(links));
			saving = true;
			return async ({ result }) => {
				if (result.type === 'success') {
					saveMessage = (result.data as Record<string, unknown>)?.message as string ?? 'Berhasil disimpan';
					saveError = '';
					validationErrors = {};
				} else if (result.type === 'failure') {
					const data = result.data as Record<string, unknown>;
					saveError = data?.message as string ?? 'Validasi gagal';
					saveMessage = '';
					validationErrors = (data?.linkErrors as Record<number, Record<string, string>>) ?? {};
				}
				saving = false;
			};
		}}>
			<input type="hidden" name="links" value={JSON.stringify(links)} />

			{#if saveMessage}
				<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{saveMessage}</div>
			{/if}
			{#if saveError}
				<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{saveError}</div>
			{/if}

			<div class="grid gap-4">
				{#each links as link, i (i)}
					<div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-3">
								{#if iconMap[link.iconKey]}
									<span class="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
										{@render renderIcon(link.iconKey, 'size-4')}
									</span>
								{:else}
									<span class="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
								{/if}
								<h3 class="font-semibold text-slate-900">{link.platform || `Social ${i + 1}`}</h3>
							</div>
							<button
								type="button"
								onclick={() => removeLink(i)}
								class="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
								aria-label="Hapus social media"
							>
								<Trash2 class="size-4" />
							</button>
						</div>

						<div class="grid gap-4">
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Platform</label>
									<Input bind:value={link.platform} required placeholder="contoh: Instagram" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none {validationErrors[i]?.platform ? 'border-red-400' : ''}" />
									{#if validationErrors[i]?.platform}
										<p class="text-xs text-red-600">{validationErrors[i].platform}</p>
									{/if}
								</div>
								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">URL</label>
									<Input bind:value={link.url} required placeholder="https://instagram.com/..." class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none {validationErrors[i]?.url ? 'border-red-400' : ''}" />
									{#if validationErrors[i]?.url}
										<p class="text-xs text-red-600">{validationErrors[i].url}</p>
									{/if}
								</div>
							</div>
							<div class="space-y-1.5">
								<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Icon</label>
								<div class="flex items-center gap-3">
									{#if iconMap[link.iconKey]}
										<div class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
											{@render renderIcon(link.iconKey, 'size-5')}
										</div>
									{/if}
									<div class="min-w-0 flex-1">
										<FormCombobox
											name="icon-{i}"
											label=""
											items={iconOptions}
											bind:value={link.iconKey}
											onSelect={(v) => handleIconSelect(i, v)}
											placeholder="Pilih icon..."
											searchPlaceholder="Cari icon..."
											error={validationErrors[i]?.iconKey}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if links.length === 0}
				<div class="py-16 text-center">
					<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
						<Share2 class="size-6 text-slate-300" />
					</span>
					<h3 class="text-sm font-semibold text-slate-900">Belum ada social media</h3>
					<p class="mt-1 text-xs text-slate-400">Klik tombol di bawah untuk menambah social media pertama</p>
				</div>
			{/if}

			<div class="mt-6 flex items-center gap-3">
				<Button type="submit" disabled={saving} class="rounded-full bg-brand px-8 text-white hover:bg-brand/90">
					{saving ? 'Menyimpan...' : 'Simpan Social Media'}
				</Button>
				<Button type="button" variant="outline" onclick={addLink} class="rounded-full border-dashed px-6">
					<Plus class="size-4" />
					Tambah Social Media
				</Button>
			</div>
		</form>
	</section>
</div>
