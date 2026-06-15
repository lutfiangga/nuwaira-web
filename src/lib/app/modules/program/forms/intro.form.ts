import type { FormSchema } from '$lib/types/form-builder';

export function getUpsertIntroFormSchema(): FormSchema {
	return [
		{
			type: 'grid',
			columns: 2,
			children: [
				{ name: 'introEyebrow', label: 'Intro Eyebrow', type: 'text', required: true },
				{ name: 'introTitle', label: 'Intro Title', type: 'text', required: true }
			]
		},
		{
			name: 'introImage',
			label: 'Intro Image',
			type: 'file',
			accept: 'image/*',
			maxSize: 1024 * 1024 * 5,
			multiple: false,
			required: true
		},
		{ name: 'introImageAlt', label: 'Intro Image Alt', type: 'text', required: true }
	];
}
