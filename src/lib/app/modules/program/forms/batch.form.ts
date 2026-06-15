import type { FormSchema, SelectOption } from '$lib/types/form-builder';

const LOCATION_TYPE_OPTIONS: SelectOption[] = [
	{ value: 'onsite', label: 'Onsite' },
	{ value: 'remote', label: 'Remote' }
];

const DAY_OPTIONS: SelectOption[] = [
	{ value: 1, label: 'Senin' },
	{ value: 2, label: 'Selasa' },
	{ value: 3, label: 'Rabu' },
	{ value: 4, label: 'Kamis' },
	{ value: 5, label: 'Jumat' },
	{ value: 6, label: 'Sabtu' },
	{ value: 0, label: 'Minggu' }
];

export function getCreateBatchFormSchema(offeringOptions: SelectOption[]): FormSchema {
	return [
		{
			type: 'grid',
			columns: 1,
			children: [
				{
					name: 'offeringId',
					label: 'Offering',
					type: 'select',
					required: true,
					options: offeringOptions
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
							placeholder: 'Batch #010'
						},
						{
							name: 'slug',
							label: 'Slug',
							type: 'text',
							required: true,
							placeholder: 'batch-010',
							slugOrigin: 'title'
						}
					]
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2026-07-01' },
						{ name: 'endDate', label: 'End Date', type: 'text', placeholder: '2026-11-30' }
					]
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{
							name: 'registrationOpenAt',
							label: 'Registration Open',
							type: 'text',
							placeholder: '2026-06-01'
						},
						{
							name: 'registrationCloseAt',
							label: 'Registration Close',
							type: 'text',
							placeholder: '2026-06-30'
						}
					]
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'capacity', label: 'Capacity', type: 'number', placeholder: '20' },
						{ name: 'isOpen', label: 'Open for Registration', type: 'switch' }
					]
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{
							name: 'locationType',
							label: 'Location Type',
							type: 'select',
							required: true,
							options: LOCATION_TYPE_OPTIONS
						},
						{
							name: 'location',
							label: 'Alamat (jika onsite)',
							type: 'text',
							placeholder: 'Jl. Contoh No. 123, Jakarta'
						}
					]
				},
				{
					name: 'days',
					label: 'Hari Kelas',
					type: 'checkbox-group',
					required: true,
					options: DAY_OPTIONS,
					description: 'Pilih satu atau beberapa hari untuk jadwal rutin batch.'
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'startTime', label: 'Jam Mulai', type: 'time', required: true },
						{ name: 'endTime', label: 'Jam Selesai', type: 'time', required: true }
					]
				}
			]
		}
	];
}

export function getEditBatchFormSchema(offeringOptions: SelectOption[]): FormSchema {
	return getCreateBatchFormSchema(offeringOptions);
}
