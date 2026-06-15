import type { DataTableColumn } from '$lib/types/data-table';

export const eventDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'title', label: 'Acara', sortable: true, searchable: true },
	{ accessorKey: 'slug', label: 'Slug', sortable: true, searchable: true },
	{ accessorKey: 'summary', label: 'Summary', sortable: false, customCell: true },
	{ accessorKey: 'startAt', label: 'Mulai', sortable: true, type: 'date' },
	{ accessorKey: 'endAt', label: 'Selesai', sortable: true, type: 'date' },
	{ accessorKey: 'isActive', label: 'Active', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const eventExportColumns: DataTableColumn[] = [
	{ accessorKey: 'title', label: 'Acara' },
	{ accessorKey: 'slug', label: 'Slug' },
	{ accessorKey: 'summary', label: 'Summary' },
	{ accessorKey: 'startAt', label: 'Start Date' },
	{ accessorKey: 'endAt', label: 'End Date' },
	{ accessorKey: 'isActive', label: 'Active' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
