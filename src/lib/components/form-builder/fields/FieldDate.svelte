<script lang="ts">
	import FormDatePicker from '$lib/components/forms/form-date-picker.svelte';
	import type { DateFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: DateFieldConfig; value?: string | Date | null } = $props();
</script>

<FormDatePicker
	name={config.name}
	label={config.label}
	bind:value
	placeholder={config.placeholder ?? 'Pilih tanggal'}
	description={config.description}
	required={config.required}
	disabled={config.disabled}
	min={config.min}
	max={config.max}
/>
