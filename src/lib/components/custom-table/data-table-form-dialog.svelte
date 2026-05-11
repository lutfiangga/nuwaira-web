<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { FormField } from '$lib/types/data-table';
	import type { FormSchema } from '$lib/types/form-builder';
	import FormBuilder from '$lib/components/form-builder/FormBuilder.svelte';

	let {
		open = $bindable(false),
		mode = 'create',
		data = null,
		fields,
		schema,
		action,
		title,
		description
	}: {
		open: boolean;
		mode?: 'create' | 'edit';
		data?: any;
		fields?: FormField[]; // Legacy
		schema?: FormSchema; // New
		action: string;
		title?: string;
		description?: string;
	} = $props();

	const isEdit = $derived(mode === 'edit');
	const dialogTitle = $derived(title || (isEdit ? 'Edit Item' : 'Create Item'));
	const dialogDesc = $derived(
		description || (isEdit ? 'Make changes to the item.' : 'Add a new item.')
	);

	// Initial data handling
	let formData = $state<Record<string, any>>({});

	$effect(() => {
		if (open) {
			// Reset or Fill data
			if (isEdit && data) {
				formData = { ...data };
			} else {
				// If schema, maybe we can set defaults?
				// For now, empty object or minimal defaults from legacy fields
				if (fields) {
					fields.forEach((f) => (formData[f.name] = f.value ?? ''));
				} else {
					formData = {};
				}
			}
		}
	});

	function onSuccess() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{dialogTitle}</Dialog.Title>
			<Dialog.Description>{dialogDesc}</Dialog.Description>
		</Dialog.Header>

		{#if schema}
			<FormBuilder {schema} bind:data={formData} {action} onsuccess={onSuccess} />
		{:else if fields}
			<!-- Legacy support or fallback if needed, but for now assuming we migrate usage -->
			<div class="p-4 text-red-500">
				Please provide a FormSchema. Legacy fields not fully supported in this refactor step (or
				implemented via minimal FormBuilder mapping if strict legacy support needed).
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
