import type { FormSchema } from '$lib/types/form-builder';

export function getCreateProgramFormSchema(): FormSchema {
	return [
		{
			type: 'section',
			title: 'Informasi Dasar',
			children: [
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Web Development Fundamental' },
						{ name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'web-development-fundamental', slugOrigin: 'title' }
					]
				},
				{ name: 'summary', label: 'Summary', type: 'textarea', required: true, rows: 3 },
				{ name: 'eyebrow', label: 'Eyebrow', type: 'text', required: true, placeholder: 'Program Fundamental' }
			]
		},
		{
			type: 'section',
			title: 'Hero Image',
			children: [
				{
					name: 'heroImage',
					label: 'Hero Image',
					type: 'file',
					accept: 'image/*',
					maxSize: 1024 * 1024 * 5,
					multiple: false,
					required: true
				},
				{ name: 'heroImageAlt', label: 'Hero Image Alt', type: 'text', required: true }
			]
		},
		{
			type: 'section',
			title: 'Status',
			children: [
				{ name: 'status', label: 'Status', type: 'select', required: true, options: [
					{ value: 'draft', label: 'Draft' },
					{ value: 'published', label: 'Published' },
					{ value: 'archived', label: 'Archived' }
				] }
			]
		}
	];
}

export function getEditProgramFormSchema(): FormSchema {
	return getCreateProgramFormSchema();
}
