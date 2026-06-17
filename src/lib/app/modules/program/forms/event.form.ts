import type { FormSchema } from '$lib/types/form-builder';

export const OTHER_EVENT_TYPE_VALUE = '__other__';

export const EVENT_TYPE_OPTIONS = [
	{ value: 'Workshop', label: 'Workshop' },
	{ value: 'Seminar', label: 'Seminar' },
	{ value: 'Webinar', label: 'Webinar' },
	{ value: 'Bootcamp', label: 'Bootcamp' },
	{ value: 'Open House', label: 'Open House' },
	{ value: OTHER_EVENT_TYPE_VALUE, label: 'Lainnya' }
];

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
				{
					name: 'description',
					label: 'Description',
					type: 'textarea',
					required: true,
					rows: 6,
					placeholder: 'Deskripsi lengkap acara...'
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{
							name: 'eventType',
							label: 'Tipe Acara',
							type: 'select',
							placeholder: 'Pilih tipe',
							options: EVENT_TYPE_OPTIONS
						},
						{
							name: 'eventTypeOther',
							label: 'Tipe Acara Lainnya',
							type: 'text',
							placeholder: 'Masukkan tipe acara',
							visibleWhen: { field: 'eventType', equals: OTHER_EVENT_TYPE_VALUE }
						}
					]
				}
			]
		},
		{
			type: 'section',
			title: 'Media',
			children: [
				{
					type: 'grid',
					columns: 1,
					children: [
						{
							name: 'imageUrl',
							label: 'Thumbnail',
							type: 'file',
							accept: 'image/*',
							maxSize: 1024 * 1024 * 5,
							multiple: false
						}
					]
				}
			]
		},
		{
			type: 'section',
			title: 'Lokasi & Harga',
			children: [
				{ name: 'location', label: 'Lokasi', type: 'text', placeholder: 'Alamat / venue acara' },
				{ name: 'priceAmount', label: 'Harga (IDR)', type: 'text', placeholder: '0 = gratis' }
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
						{
							name: 'startAt',
							label: 'Tanggal Mulai',
							type: 'date',
							placeholder: 'Pilih tanggal mulai'
						},
						{
							name: 'startTime',
							label: 'Jam Mulai',
							type: 'time',
							placeholder: '09:00'
						},
						{
							name: 'endAt',
							label: 'Tanggal Selesai',
							type: 'date',
							placeholder: 'Pilih tanggal selesai'
						},
						{
							name: 'endTime',
							label: 'Jam Selesai',
							type: 'time',
							placeholder: '12:00'
						}
					]
				}
			]
		},
		{
			type: 'section',
			title: 'Status',
			children: [
				{ name: 'isActive', label: 'Active', type: 'switch', defaultValue: true }
			]
		}
	];
}

export function getEditEventFormSchema(): FormSchema {
	return getCreateEventFormSchema();
}
