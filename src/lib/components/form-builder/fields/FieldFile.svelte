<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { X, Upload, Link, ClipboardPaste } from '@lucide/svelte';
	import type { FileFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: FileFieldConfig; value: any } = $props();

	let existingImages: string[] = $state([]);
	let newFilesPreviews: string[] = $state([]);
	let newFiles: File[] = $state([]);
	let deletedImages: string[] = $state([]);
	let fileInput = $state<HTMLInputElement | null>(null);
	let errors: string[] = $state([]);
	let urlInput = $state('');
	let showUrlInput = $state(false);
	let isDragOver = $state(false);

	$effect(() => {
		if (existingImages.length === 0 && deletedImages.length === 0) {
			if (typeof value === 'string' && value.length > 0) {
				existingImages = [value];
			} else if (Array.isArray(value) && value.length > 0) {
				existingImages = [...value];
			}
		}
	});

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragOver = true;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer!.dropEffect = 'copy';
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		const target = e.currentTarget as HTMLElement;
		const related = e.relatedTarget as Node | null;
		if (target === e.target || !target.contains(related)) {
			isDragOver = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragOver = false;
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			errors = [];
			addFiles(Array.from(files));
		}
	}

	function addFiles(files: File[]) {
		const validFiles: File[] = [];
		files.forEach((file) => {
			if (config.maxSize && file.size > config.maxSize) {
				errors = [...errors, `File ${file.name} exceeds max size of ${formatBytes(config.maxSize)}`];
				return;
			}
			validFiles.push(file);
		});

		if (validFiles.length === 0) return;

		if (config.multiple) {
			newFiles = [...newFiles, ...validFiles];
		} else {
			existingImages = [];
			newFiles = validFiles;
			newFilesPreviews = [];
		}

		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					newFilesPreviews = [...newFilesPreviews, e.target.result as string];
				}
			};
			reader.readAsDataURL(file);
		});

		updateFileInput();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		errors = [];
		if (files && files.length > 0) addFiles(Array.from(files));
	}

	async function handleUrlAdd() {
		const url = urlInput.trim();
		if (!url) return;
		errors = [];
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch URL');
			const blob = await response.blob();
			const ext = blob.type.split('/')[1] || 'jpg';
			const filename = url.split('/').pop()?.split('?')[0] || `download.${ext}`;
			const file = new File([blob], filename, { type: blob.type });
			addFiles([file]);
			urlInput = '';
			showUrlInput = false;
		} catch (e: any) {
			errors = [...errors, `Failed to load URL: ${e.message}`];
		}
	}

	function handleClipboardPaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (!items) return;
		for (const item of Array.from(items)) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				const file = item.getAsFile();
				if (file) addFiles([file]);
				return;
			}
		}
	}

	function updateFileInput() {
		if (fileInput) {
			const dt = new DataTransfer();
			newFiles.forEach((file) => { dt.items.add(file); });
			fileInput.files = dt.files;
		}
	}

	function removeExistingImage(index: number) {
		deletedImages = [...deletedImages, existingImages[index]];
		existingImages = existingImages.filter((_, i) => i !== index);
	}

	function removeNewFile(index: number) {
		newFiles = newFiles.filter((_, i) => i !== index);
		newFilesPreviews = newFilesPreviews.filter((_, i) => i !== index);
		updateFileInput();
	}

	function clearSingle() {
		if (fileInput) fileInput.value = '';
		existingImages = [];
		newFiles = [];
		newFilesPreviews = [];
		deletedImages = [];
		value = null;
	}

	const allPreviews = $derived([...existingImages, ...newFilesPreviews]);
	const existingCount = $derived(existingImages.length);

	function handleRemove(index: number) {
		if (!config.multiple) { clearSingle(); }
		else if (index < existingCount) { removeExistingImage(index); }
		else { removeNewFile(index - existingCount); }
	}

	function formatBytes(bytes: number, decimals = 2) {
		if (!+bytes) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
</script>

<div
	class="space-y-3 {config.class}"
	role="region"
	aria-label="File upload area"
	onpaste={handleClipboardPaste}
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
		{#if config.maxSize}
			<span class="text-xs text-muted-foreground ml-2">(Max {formatBytes(config.maxSize)})</span>
		{/if}
	</Label>

	{#if config.path}
		<input type="hidden" name="{config.name}_path" value={config.path} />
	{/if}
	<input type="hidden" name="{config.name}_multiple" value={config.multiple ? 'true' : 'false'} />
	{#each existingImages as img}
		<input type="hidden" name="{config.name}_existing" value={img} />
	{/each}
	{#each deletedImages as img}
		<input type="hidden" name="{config.name}_deleted" value={img} />
	{/each}

	{#if allPreviews.length > 0}
		<div class="flex flex-wrap gap-3">
			{#each allPreviews as url, i}
				<div class="relative group rounded-xl border bg-muted/20 overflow-hidden">
					<button
						type="button"
						class="absolute top-1 right-1 rounded-full bg-destructive/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
						onclick={() => handleRemove(i)}
					>
						<X class="h-3 w-3" />
					</button>
					<img src={url} alt="" class="h-24 w-32 object-cover pointer-events-none" draggable="false" />
					<div class="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-0.5">
						<span class="text-xs text-white">{i < existingCount ? 'existing' : 'new'}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#each errors as error}
		<p class="text-xs text-destructive">{error}</p>
	{/each}

	<input bind:this={fileInput} id={config.name} name={config.name} type="file" accept={config.accept} multiple={config.multiple} required={config.required && allPreviews.length === 0} onchange={handleFileChange} class="hidden" />

	<label
		for={config.name}
		class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed {isDragOver ? 'border-primary bg-primary/5 text-primary' : 'border-muted-foreground/25 hover:border-primary/50 bg-muted/10'} p-6 cursor-pointer transition-all"
	>
		<Upload class="h-8 w-8 {isDragOver ? 'text-primary' : 'text-muted-foreground'}" />
		<div class="text-center">
			<p class="text-sm font-medium">{isDragOver ? 'Drop files here' : 'Drag & drop files here'}</p>
			<p class="text-xs text-muted-foreground mt-1">or click to browse</p>
		</div>
	</label>

	<div class="flex flex-wrap items-center gap-2">
		<Button type="button" variant="outline" size="sm" class="rounded-lg" onclick={() => (showUrlInput = !showUrlInput)}>
			<Link class="h-4 w-4 mr-2" />
			URL
		</Button>

		<span class="text-xs text-muted-foreground flex items-center gap-1 ml-1">
			<ClipboardPaste class="h-3 w-3" />
			or paste from clipboard
		</span>
	</div>

	{#if showUrlInput}
		<div class="flex items-center gap-2">
			<Input type="url" bind:value={urlInput} placeholder="https://example.com/image.jpg" class="flex-1" onkeydown={(e) => e.key === 'Enter' && handleUrlAdd()} />
			<Button type="button" size="sm" onclick={handleUrlAdd} disabled={!urlInput.trim()} class="rounded-lg">Add</Button>
			<Button type="button" variant="ghost" size="icon" onclick={() => (showUrlInput = false)}><X class="h-4 w-4" /></Button>
		</div>
	{/if}

	{#if config.description}
		<p class="text-xs text-muted-foreground">{config.description}</p>
	{/if}
</div>
