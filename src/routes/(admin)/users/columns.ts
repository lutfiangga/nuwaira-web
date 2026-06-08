import type { DataTableColumn } from '$lib/types/data-table';

export const userColumns: DataTableColumn[] = [
	{
		id: 'select',
		type: 'select',
		sortable: false
	},
	{
		accessorKey: 'photo',
		label: 'Photo',
		type: 'image',
		sortable: false
	},
	{
		accessorKey: 'id',
		label: 'ID',
		sortable: true,
		hidden: true
	},
	{
		accessorKey: 'name',
		label: 'Name',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'email',
		label: 'Email',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'role',
		label: 'Role',
		sortable: true
	},
	{
		id: 'actions',
		type: 'actions',
		sortable: false
	}
];
