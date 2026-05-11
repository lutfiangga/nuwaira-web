<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { X, FileText, Image, File as FileIcon } from '@lucide/svelte';
	import type { FileFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: FileFieldConfig; value: any } = $props();

	// Track existing images (URLs from database) and new files separately
	let existingImages: string[] = $state([]);
	let newFilesPreviews: string[] = $state([]);
	let newFiles: File[] = $state([]);
	let deletedImages: string[] = $state([]);
	let fileInput = $state<HTMLInputElement | null>(null);
	let errors: string[] = $state([]);

	// Initialize from value (existing images from database)
	$effect(() => {
		if (existingImages.length === 0 && deletedImages.length === 0) {
			if (typeof value === 'string' && value.length > 0) {
				existingImages = [value];
			} else if (Array.isArray(value) && value.length > 0) {
				existingImages = [...value];
			}
		}
	});

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		errors = [];
		if (files && files.length > 0) {
			addFiles(Array.from(files));
		}
	}

	function addFiles(files: File[]) {
		// Validation
		const validFiles: File[] = [];
		files.forEach((file) => {
			if (config.maxSize && file.size > config.maxSize) {
				errors = [
					...errors,
					`File ${file.name} exceeds max size of ${formatBytes(config.maxSize)}`
				];
				return;
			}
			validFiles.push(file);
		});

		if (validFiles.length === 0) return;

		if (config.multiple) {
			// Append to existing new files
			newFiles = [...newFiles, ...validFiles];
		} else {
			// Single file - replace everything
			existingImages = [];
			newFiles = validFiles;
			newFilesPreviews = [];
		}

		// Generate previews for new files
		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					newFilesPreviews = [...newFilesPreviews, e.target.result as string];
				}
			};
			reader.readAsDataURL(file);
		});

		// Update file input
		updateFileInput();
	}

	function updateFileInput() {
		if (fileInput) {
			const dt = new DataTransfer();
			newFiles.forEach((file) => {
				dt.items.add(file);
			});
			fileInput.files = dt.files;
		}
	}

	function removeExistingImage(index: number) {
		const removed = existingImages[index];
		deletedImages = [...deletedImages, removed];
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

	// Combined preview for display
	const allPreviews = $derived([...existingImages, ...newFilesPreviews]);
	const existingCount = $derived(existingImages.length);

	function handleRemove(index: number) {
		if (!config.multiple) {
			clearSingle();
		} else if (index < existingCount) {
			removeExistingImage(index);
		} else {
			removeNewFile(index - existingCount);
		}
	}

	function getIconForFile(url: string) {
		if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('data:image')) return 'image';
		if (url.match(/\.pdf$/i)) return 'pdf';
		return 'file';
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

<div class="space-y-2 {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
		{#if config.maxSize}
			<span class="text-xs text-muted-foreground ml-2">(Max {formatBytes(config.maxSize)})</span>
		{/if}
	</Label>

	<!-- Hidden inputs for backend -->
	{#if config.path}
		<input type="hidden" name="{config.name}_path" value={config.path} />
	{/if}
	<input type="hidden" name="{config.name}_multiple" value={config.multiple ? 'true' : 'false'} />

	<!-- Send existing images that should be kept -->
	{#each existingImages as img}
		<input type="hidden" name="{config.name}_existing" value={img} />
	{/each}

	<!-- Send deleted images info -->
	{#each deletedImages as img}
		<input type="hidden" name="{config.name}_deleted" value={img} />
	{/each}

	{#if allPreviews.length > 0}
		<div class="flex flex-wrap gap-4 mb-2">
			{#each allPreviews as url, i}
				<div class="relative group border rounded-lg p-2 bg-muted/20">
					<Button
						type="button"
						variant="destructive"
						size="icon"
						class="absolute -top-2 -right-2 h-6 w-6 z-10"
						onclick={() => handleRemove(i)}
					>
						<X class="w-3 h-3" />
					</Button>

					{#if getIconForFile(url) === 'image'}
						<img src={url} alt="Preview" class="h-20 w-20 object-cover rounded-md" />
					{:else}
						<div class="h-20 w-20 flex flex-col items-center justify-center text-muted-foreground">
							{#if getIconForFile(url) === 'pdf'}
								<FileText class="w-8 h-8 mb-1" />
								<span class="text-xs uppercase">PDF</span>
							{:else}
								<FileIcon class="w-8 h-8 mb-1" />
								<span class="text-xs uppercase">FILE</span>
							{/if}
						</div>
					{/if}

					{#if typeof url === 'string' && !url.startsWith('data:')}
						<div class="text-[10px] text-center mt-1 w-20 truncate">{url.split('/').pop()}</div>
					{/if}

					<!-- Badge to show if existing or new -->
					{#if i < existingCount}
						<div class="text-[8px] text-center text-muted-foreground">existing</div>
					{:else}
						<div class="text-[8px] text-center text-green-600">new</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#each errors as error}
		<p class="text-xs text-destructive">{error}</p>
	{/each}

	<div class="flex items-center gap-2">
		<Input
			bind:ref={fileInput}
			id={config.name}
			name={config.name}
			type="file"
			accept={config.accept}
			multiple={config.multiple}
			required={config.required && allPreviews.length === 0}
			onchange={handleFileChange}
			class="cursor-pointer"
		/>
	</div>

	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
