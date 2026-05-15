import type { DataTableColumn } from '$lib/types/data-table';

export interface StudentRow {
	id: string;
	studentCode: string;
	fullName: string;
	email: string;
	phone?: string | null;
	gender: string;
	track: string;
	companyName?: string | null;
	status: string;
	createdAt: Date | string | null;
	updatedAt: Date | string | null;
}

export const studentColumns: DataTableColumn<StudentRow>[] = [
	{
		id: 'select',
		type: 'select'
	},
	{
		accessorKey: 'studentCode',
		label: 'Code',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'fullName',
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
		accessorKey: 'phone',
		label: 'Phone',
		sortable: false,
		searchable: true
	},
	{
		accessorKey: 'track',
		label: 'Track',
		sortable: true
	},
	{
		accessorKey: 'companyName',
		label: 'Company',
		sortable: false,
		searchable: true
	},
	{
		accessorKey: 'status',
		label: 'Status',
		sortable: true
	},
	{
		accessorKey: 'createdAt',
		label: 'Created',
		type: 'date',
		sortable: true
	},
	{
		id: 'actions',
		type: 'actions'
	}
];
