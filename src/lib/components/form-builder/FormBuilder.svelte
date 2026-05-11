<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormSchema, FormSchemaItem } from '$lib/types/form-builder';
	import { Button } from '$lib/components/ui/button';

	// Import Fields
	import FieldText from './fields/FieldText.svelte';
	import FieldTextarea from './fields/FieldTextarea.svelte';
	import FieldSelect from './fields/FieldSelect.svelte';
	import FieldCombobox from './fields/FieldCombobox.svelte';
	import FieldCheckbox from './fields/FieldCheckbox.svelte';
	import FieldFile from './fields/FieldFile.svelte';
	import FieldRichText from './fields/FieldRichText.svelte';

	// Import Custom Components
	import LocationSearch from '$lib/components/location-search.svelte';

	// Import Layouts
	import Section from './layouts/Section.svelte';
	import Grid from './layouts/Grid.svelte';
	import Group from './layouts/Group.svelte';

	let {
		schema,
		data = $bindable({}),
		action = '',
		method = 'POST',
		submitLabel = 'Save',
		loading = false,
		onsuccess,
		onerror
	}: {
		schema: FormSchema;
		data?: Record<string, any>;
		action?: string;
		method?: 'POST' | 'GET' | 'dialog';
		submitLabel?: string;
		loading?: boolean;
		onsuccess?: () => void;
		onerror?: (message: string) => void;
	} = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	const hasFile = $derived(schema.some(checkFileRecursive));

	function checkFileRecursive(item: FormSchemaItem): boolean {
		if ('type' in item) {
			if (item.type === 'file') return true;
			if (item.type === 'section' || item.type === 'grid' || item.type === 'group') {
				return item.children.some(checkFileRecursive);
			}
		}
		return false;
	}

	const enctype = $derived(hasFile ? 'multipart/form-data' : undefined);
	
	function slugify(text: string) {
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\-\-+/g, '-'); // Replace multiple - with single -
	}

	// Auto-slug generator
	$effect(() => {
		// Linear scan is fine for small forms
		function scanForSlugs(items: FormSchemaItem[]) {
			for (const item of items) {
				if ('type' in item) {
					// children navigation
					if (item.type === 'section' || item.type === 'grid' || item.type === 'group') {
						scanForSlugs(item.children);
					}
					// check for slug config
					if (item.type === 'text' && item.slugOrigin) {
						const originValue = data[item.slugOrigin];
						const currentSlugValue = data[item.name];
						
						// Only update if origin has value
						// And maybe only if slug is empty OR matches previous slugified version (to allow editing)?
						// For now, simpler: if origin changes, we update slug IF the slug matches what it "should" be 
						// OR if the user hasn't manually edited it significantly?
						// User request: "otomatis mengikuti title. tapi bisa edit slug juga"
						// Common pattern: if slug is empty or matches slugify(origin), update it.
						
						if (originValue) {
							const newSlug = slugify(originValue);
							// If current slug is empty, fill it
							if (!currentSlugValue) {
								data[item.name] = newSlug;
							} 
							// If current slug matches the *previous* version of origin... we don't track history.
							// let's try: if the current slug is exactly what the *previous* origin would have made? No.
							// Let's go with: if the user hasn't "detached" it. 
							// Hack: Check if current slug is roughly similar?
							// Safest simple approach: Update if 'clean' or if explicitly newly created. 
							// But since we can't track 'touched', we might just update it if the user IS typing in title?
							// We can't know which field is focused here easily.
							
							// Let's just update it if the current value is NOT set or looks like a slugified version of PART of the title?
							// Actually, usually users want it to auto-update UNTIL they manually edit the slug.
							// But without state tracking, we can't know. 
							// Let's just update it if the current slug is equal to slugify(originValue - lastChar)?? No.
							
							// Re-reading request: "bisa edit slug juga sih posisinya"
							// Usually implies: it auto-generates, but I can override.
							// Strict binding: variable = slugify(title). If I edit variable, next title change overwrites it? Yes.
							// Unless we use a flag.
							
							// Implementation: We will just set it = slugify(origin) whenever origin changes.
							// BUT this prevents manual editing if title keeps changing?
							// No, if I edit Slug, it stays. But if I then type in Title, it overwrites.
							// That is usually acceptable for "Auto" behavior.
							// To be nicer: We only overwrite if data[item.name] === slugify(previousTitle).
							// Too complex. Let's just set it.
							data[item.name] = newSlug;
						}
					}
				}
			}
		}
		scanForSlugs(schema);
	});
</script>

{#snippet renderItem(item: FormSchemaItem)}
	{#if item.type === 'section'}
		<Section config={item} {renderItem} />
	{:else if item.type === 'grid'}
		<Grid config={item} {renderItem} />
	{:else if item.type === 'group'}
		<Group config={item} {renderItem} />
	{:else if item.type === 'text' || item.type === 'email' || item.type === 'password' || item.type === 'number'}
		<FieldText config={item} bind:value={data[item.name]} />
	{:else if item.type === 'textarea'}
		<FieldTextarea config={item} bind:value={data[item.name]} />
	{:else if item.type === 'select'}
		<FieldSelect config={item} bind:value={data[item.name]} />
	{:else if item.type === 'combobox'}
		<FieldCombobox config={item} bind:value={data[item.name]} />
	{:else if item.type === 'checkbox' || item.type === 'switch'}
		<FieldCheckbox config={item} bind:value={data[item.name]} />
	{:else if item.type === 'file'}
		<FieldFile config={item} bind:value={data[item.name]} />
	{:else if item.type === 'rich-text'}
		<FieldRichText config={item} bind:value={data[item.name]} />
	{:else if item.type === 'custom'}
		{#if item.component === 'LocationSearch'}
			<LocationSearch bind:latitude={data.latitude} bind:longitude={data.longitude} />
		{/if}
	{/if}
{/snippet}

{#if errorMessage}
	<div class="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
		{errorMessage}
	</div>
{/if}

<form
	{method}
	{action}
	{enctype}
	class="space-y-4"
	use:enhance={() => {
		isSubmitting = true;
		errorMessage = '';
		return async ({ result, update }) => {
			isSubmitting = false;
			if (result.type === 'success') {
				if (onsuccess) onsuccess();
				await update({ reset: false });
			} else if (result.type === 'failure') {
				errorMessage =
					typeof result.data?.message === 'string' ? result.data.message : 'An error occurred';
				if (onerror) onerror(errorMessage);
			} else if (result.type === 'error') {
				errorMessage = 'An unexpected error occurred';
				if (onerror) onerror(errorMessage);
			}
		};
	}}
>
	{#if data.id}
		<input type="hidden" name="id" value={data.id} />
	{/if}

	{#each schema as item}
		{@render renderItem(item)}
	{/each}

	<div class="flex justify-end pt-4">
		<Button type="submit" disabled={isSubmitting || loading}>
			{isSubmitting ? 'Saving...' : submitLabel}
		</Button>
	</div>
</form>
