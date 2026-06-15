<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import type { CheckboxGroupFieldConfig } from '$lib/types/form-builder';

	let {
		config,
		value = $bindable([])
	}: {
		config: CheckboxGroupFieldConfig;
		value: Array<string | number>;
	} = $props();

	function selectedValues() {
		return Array.isArray(value) ? value : [];
	}

	function isSelected(optionValue: string | number) {
		return selectedValues().some((item) => String(item) === String(optionValue));
	}

	function toggle(optionValue: string | number, checked: boolean) {
		value = checked
			? [...selectedValues().filter((item) => String(item) !== String(optionValue)), optionValue]
			: selectedValues().filter((item) => String(item) !== String(optionValue));
	}
</script>

<fieldset class="space-y-2 {config.class}">
	<legend class="text-sm font-medium">
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
	</legend>

	<div class="flex flex-wrap gap-3">
		{#each config.options as option (option.value)}
			{@const inputId = `${config.name}-${option.value}`}
			<div class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
				<Checkbox
					id={inputId}
					checked={isSelected(option.value)}
					onCheckedChange={(checked) => toggle(option.value, checked === true)}
					disabled={config.disabled}
				/>
				<Label for={inputId} class="cursor-pointer text-sm font-normal">{option.label}</Label>
			</div>
		{/each}
	</div>

	<input type="hidden" name={config.name} value={JSON.stringify(selectedValues())} />

	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</fieldset>
