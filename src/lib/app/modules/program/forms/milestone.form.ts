import type { FormSchema, SelectOption } from '$lib/types/form-builder';

const ICON_OPTIONS: SelectOption[] = [
	{ value: 'foundation', label: 'Foundation' },
	{ value: 'logic', label: 'Logic' },
	{ value: 'professional', label: 'Professional' },
	{ value: 'capstone', label: 'Capstone' }
];

export function getCreateMilestoneFormSchema(
	programOptions: SelectOption[],
	technologyOptions: SelectOption[]
): FormSchema {
	return [
		{
			type: 'section',
			title: 'Informasi Milestone',
			children: [
				{ name: 'programId', label: 'Program', type: 'select', required: true, options: programOptions },
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Fondasi' },
						{ name: 'weeks', label: 'Weeks', type: 'text', required: true, placeholder: 'Minggu 1-4' }
					]
				},
				{ name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
				{ name: 'output', label: 'Output', type: 'textarea', required: true, rows: 2 },
				{
					type: 'grid',
					columns: 3,
					children: [
						{ name: 'icon', label: 'Icon', type: 'select', required: true, options: ICON_OPTIONS },
						{ name: 'position', label: 'Position', type: 'number', required: true, placeholder: '1' },
						{ name: 'technologyIds', label: 'Technologies', type: 'select', multiple: true, options: technologyOptions }
					]
				}
			]
		}
	];
}

export function getEditMilestoneFormSchema(
	programOptions: SelectOption[],
	technologyOptions: SelectOption[]
): FormSchema {
	return getCreateMilestoneFormSchema(programOptions, technologyOptions);
}
