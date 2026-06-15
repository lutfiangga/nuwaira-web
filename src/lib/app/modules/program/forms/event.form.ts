import type { FormSchema } from '$lib/types/form-builder';

export function getCreateEventFormSchema(): FormSchema {
	return [
		{
			type: 'section',
			title: 'Informasi Acara',
			children: [
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Nama Acara' },
						{ name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'nama-acara', slugOrigin: 'title' }
					]
				},
				{ name: 'summary', label: 'Summary', type: 'textarea', required: true, rows: 3 },
				{ name: 'registrationUrl', label: 'Registration URL', type: 'text', placeholder: 'https://...' }
			]
		},
		{
			type: 'section',
			title: 'Waktu',
			children: [
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'startAt', label: 'Start Date', type: 'text', placeholder: '2026-07-01' },
						{ name: 'endAt', label: 'End Date', type: 'text', placeholder: '2026-07-31' }
					]
				}
			]
		},
		{
			type: 'section',
			title: 'Status',
			children: [
				{ name: 'isActive', label: 'Active', type: 'switch' }
			]
		}
	];
}

export function getEditEventFormSchema(): FormSchema {
	return getCreateEventFormSchema();
}
