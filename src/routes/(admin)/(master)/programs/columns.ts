import type { DataTableColumn } from '$lib/types/data-table';

export const programDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'title', label: 'Title', sortable: true, searchable: true },
	{ accessorKey: 'slug', label: 'Slug', sortable: true },
	{ accessorKey: 'status', label: 'Status', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const programExportColumns: DataTableColumn[] = [
	{ accessorKey: 'title', label: 'Title' },
	{ accessorKey: 'slug', label: 'Slug' },
	{ accessorKey: 'status', label: 'Status' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
