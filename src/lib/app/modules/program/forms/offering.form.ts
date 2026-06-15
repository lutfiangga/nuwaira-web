import type { FormSchema, SelectOption } from '$lib/types/form-builder';

const OFFERING_TYPE_OPTIONS: SelectOption[] = [
	{ value: 'batch', label: 'Batch' },
	{ value: 'private', label: 'Private' }
];

export function getCreateOfferingFormSchema(): FormSchema {
	return [
		{
			type: 'grid',
			columns: 2,
			children: [
				{ name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Starter' },
				{
					name: 'slug',
					label: 'Slug',
					type: 'text',
					required: true,
					placeholder: 'starter',
					slugOrigin: 'name'
				}
			]
		},
		{
			type: 'grid',
			columns: 2,
			children: [
				{
					name: 'title',
					label: 'Title',
					type: 'text',
					required: true,
					placeholder: 'Paket Starter'
				},
				{
					name: 'type',
					label: 'Type',
					type: 'select',
					required: true,
					options: OFFERING_TYPE_OPTIONS
				}
			]
		},
		{
			type: 'grid',
			columns: 2,
			children: [
				{
					name: 'priceAmount',
					label: 'Harga (Rp)',
					type: 'number',
					required: true,
					placeholder: '7500000'
				},
				{ name: 'badge', label: 'Badge', type: 'text', placeholder: 'Best Seller' }
			]
		},
		{
			name: 'benefits',
			label: 'Benefit (satu per baris)',
			type: 'textarea',
			rows: 4,
			placeholder: 'Mentoring 1-on-1\nAkses lifetime\nSertifikat'
		}
	];
}

export function getEditOfferingFormSchema(): FormSchema {
	return getCreateOfferingFormSchema();
}
