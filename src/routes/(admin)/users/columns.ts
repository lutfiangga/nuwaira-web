import type { DataTableColumn } from '$lib/types/data-table';

export const userDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'photo', label: 'Photo', type: 'image', sortable: false, headerClassName: 'w-20' },
	{ accessorKey: 'name', label: 'Name', sortable: true, searchable: true, headerClassName: 'max-w-[160px]' },
	{ accessorKey: 'email', label: 'Email', sortable: true, searchable: true },
	{ accessorKey: 'role', label: 'Role', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const userExportColumns: DataTableColumn[] = [
	{ accessorKey: 'name', label: 'Name' },
	{ accessorKey: 'email', label: 'Email' },
	{ accessorKey: 'role', label: 'Role' },
	{ accessorKey: 'studentType', label: 'Tipe' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
