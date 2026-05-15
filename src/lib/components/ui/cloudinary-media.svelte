<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Trash2, Upload, Link, ClipboardPaste, X } from '@lucide/svelte';
	import { CloudinaryService } from '$lib/app/helpers/cloudinary.service';

	type MediaItem = {
		id: string;
		url: string;
		publicId?: string;
		loading?: boolean;
		error?: string;
	};

	let {
		value = $bindable([] as string[]),
		multiple = false,
		folder = 'uploads',
		class: className = ''
	}: {
		value?: string[];
		multiple?: boolean;
		folder?: string;
		class?: string;
	} = $props();

	let items = $state<MediaItem[]>([]);
	let urlInput = $state('');
	let showUrlInput = $state(false);
	let uploading = $state(false);

	let uploadFolder = $derived.by(() => {
		const prefix = $page.data?.brand?.cloudinaryFolder || '';
		return prefix ? `${prefix}/${folder}` : folder;
	});

	$effect(() => {
		const currentUrls = value.filter(Boolean);
		items = currentUrls.map((url, i) => ({
			id: `existing-${i}-${url}`,
			url
		}));
	});

	function updateValue() {
		value = items.map(i => i.url).filter(Boolean);
	}

	async function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (!files?.length) return;

		uploading = true;
		const tempIds: string[] = [];

		for (const file of Array.from(files)) {
			const tempId = crypto.randomUUID();
			const previewUrl = URL.createObjectURL(file);
			if (!multiple) items = [];
			items = [...items, { id: tempId, url: previewUrl, loading: true }];
			tempIds.push(tempId);
		}

		try {
			const results = await CloudinaryService.uploadMultiple(Array.from(files), uploadFolder);
			items = items.map(item => {
				const idx = tempIds.indexOf(item.id);
				if (idx >= 0 && results[idx]) {
					return { id: crypto.randomUUID(), url: results[idx].url, publicId: results[idx].publicId };
				}
				return item;
			});
			updateValue();
		} catch (e: any) {
			items = items.map(item => {
				if (tempIds.includes(item.id)) {
					return { ...item, loading: false, error: e.message };
				}
				return item;
			});
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	async function handleUrlUpload() {
		const url = urlInput.trim();
		if (!url) return;

		uploading = true;
		const tempId = crypto.randomUUID();
		if (!multiple) items = [];
		items = [...items, { id: tempId, url, loading: true }];

		try {
			const result = await CloudinaryService.uploadUrl(url, uploadFolder);
			items = items.map(item =>
				item.id === tempId
					? { id: crypto.randomUUID(), url: result.url, publicId: result.publicId }
					: item
			);
			urlInput = '';
			showUrlInput = false;
			updateValue();
		} catch (e: any) {
			items = items.map(item =>
				item.id === tempId ? { ...item, loading: false, error: e.message } : item
			);
		} finally {
			uploading = false;
		}
	}

	async function handleClipboardPaste(e: ClipboardEvent) {
		const clipboardItems = e.clipboardData?.items;
		if (!clipboardItems) return;

		for (const item of Array.from(clipboardItems)) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				const file = item.getAsFile();
				if (file) {
					const fakeEvent = { target: { files: [file], value: '' } } as any;
					await handleFileUpload(fakeEvent);
				}
				return;
			}
		}
	}

	function removeItem(id: string) {
		items = items.filter(i => i.id !== id);
		updateValue();
	}
</script>

<div class="space-y-4 {className}" onpaste={handleClipboardPaste}>
	<input type="hidden" name="media_urls" value={JSON.stringify(value)} />

	<div class="flex flex-wrap gap-3">
		{#each items as item (item.id)}
			<div class="relative group rounded-xl border bg-muted/30 overflow-hidden">
				{#if item.loading}
					<div class="flex items-center justify-center h-24 w-32 bg-muted">
						<span class="text-xs text-muted-foreground animate-pulse">Uploading...</span>
					</div>
				{:else if item.error}
					<div class="flex items-center justify-center h-24 w-32 bg-destructive/10">
						<span class="text-xs text-destructive p-2 text-center">{item.error}</span>
					</div>
				{:else}
					<img src={item.url} alt="" class="h-24 w-32 object-cover" />
				{/if}
				<button
					type="button"
					class="absolute top-1 right-1 rounded-full bg-destructive/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
					onclick={() => removeItem(item.id)}
				>
					<Trash2 class="h-3 w-3" />
				</button>
			</div>
		{/each}

		{#if items.length === 0 || multiple}
			<label class="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors h-24 w-32">
				<Upload class="h-5 w-5 text-muted-foreground" />
				<span class="text-xs text-muted-foreground">Upload</span>
				<input type="file" accept="image/*" {multiple} class="hidden" onchange={handleFileUpload} disabled={uploading} />
			</label>
		{/if}
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<label class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer transition-colors">
			<Upload class="h-4 w-4 text-muted-foreground" />
			Choose File
			<input type="file" accept="image/*" {multiple} class="hidden" onchange={handleFileUpload} disabled={uploading} />
		</label>

		<Button type="button" variant="outline" size="sm" class="rounded-lg" onclick={() => (showUrlInput = !showUrlInput)} disabled={uploading}>
			<Link class="h-4 w-4 mr-2" />
			URL
		</Button>

		<div class="relative text-xs text-muted-foreground flex items-center gap-1 ml-2">
			<ClipboardPaste class="h-3 w-3" />
			<span>or paste from clipboard</span>
		</div>
	</div>

	{#if showUrlInput}
		<div class="flex items-center gap-2">
			<Input
				type="url"
				bind:value={urlInput}
				placeholder="https://example.com/image.jpg"
				class="flex-1"
				onkeydown={(e) => e.key === 'Enter' && handleUrlUpload()}
			/>
			<Button type="button" size="sm" onclick={handleUrlUpload} disabled={uploading || !urlInput.trim()} class="rounded-lg">
				Add
			</Button>
			<Button type="button" variant="ghost" size="icon" onclick={() => (showUrlInput = false)}>
				<X class="h-4 w-4" />
			</Button>
		</div>
	{/if}
</div>
