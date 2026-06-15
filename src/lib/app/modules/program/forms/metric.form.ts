import type { FormSchema } from '$lib/types/form-builder';

export function getCreateMetricFormSchema(): FormSchema {
	return [
		{
			type: 'grid',
			columns: 2,
			children: [
				{ name: 'label', label: 'Label', type: 'text', required: true, placeholder: '40 Pertemuan' },
				{ name: 'value', label: 'Value', type: 'text', required: true, placeholder: '20 Minggu' }
			]
		},
		{
			type: 'grid',
			columns: 2,
			children: [
				{ name: 'icon', label: 'Icon', type: 'text', required: true, placeholder: 'duration' },
				{ name: 'position', label: 'Position', type: 'number', required: true, placeholder: '1' }
			]
		}
	];
}

export function getEditMetricFormSchema(): FormSchema {
	return getCreateMetricFormSchema();
}
