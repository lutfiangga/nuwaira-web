import type { DataTableColumn } from '$lib/types/data-table';

export interface ClassRow {
	id: string;
	code: string;
	title: string;
	level: string;
	mode: string;
	mentorName?: string | null;
	durationWeeks: number;
	totalSessions: number;
	price: number;
	status: string;
	startDate?: Date | string | null;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
}

export const classColumns: DataTableColumn<ClassRow>[] = [
	{
		id: 'select',
		type: 'select'
	},
	{
		accessorKey: 'code',
		label: 'Code',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'title',
		label: 'Class',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'level',
		label: 'Level',
		sortable: true
	},
	{
		accessorKey: 'mode',
		label: 'Mode',
		sortable: true
	},
	{
		accessorKey: 'mentorName',
		label: 'Mentor',
		searchable: true
	},
	{
		accessorKey: 'durationWeeks',
		label: 'Weeks',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'totalSessions',
		label: 'Sessions',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'price',
		label: 'Price',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'status',
		label: 'Status',
		sortable: true
	},
	{
		accessorKey: 'startDate',
		label: 'Start Date',
		type: 'date',
		sortable: true
	},
	{
		id: 'actions',
		type: 'actions'
	}
];
