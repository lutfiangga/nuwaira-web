import type { DataTableColumn } from '$lib/types/data-table';

export const eventDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'title', label: 'Acara', sortable: true, searchable: true },
	{ accessorKey: 'slug', label: 'Slug', sortable: true, searchable: true },
	{ accessorKey: 'eventType', label: 'Tipe', sortable: true, customCell: true },
	{ accessorKey: 'location', label: 'Lokasi', sortable: true, customCell: true },
	{ accessorKey: 'priceAmount', label: 'Harga', sortable: true, customCell: true },
	{ accessorKey: 'startAt', label: 'Mulai', sortable: true, customCell: true },
	{ accessorKey: 'endAt', label: 'Selesai', sortable: true, customCell: true },
	{ accessorKey: 'isActive', label: 'Active', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const eventExportColumns: DataTableColumn[] = [
	{ accessorKey: 'title', label: 'Acara' },
	{ accessorKey: 'slug', label: 'Slug' },
	{ accessorKey: 'eventType', label: 'Tipe' },
	{ accessorKey: 'location', label: 'Lokasi' },
	{ accessorKey: 'priceAmount', label: 'Harga' },
	{ accessorKey: 'startAt', label: 'Start Date' },
	{ accessorKey: 'endAt', label: 'End Date' },
	{ accessorKey: 'isActive', label: 'Active' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
