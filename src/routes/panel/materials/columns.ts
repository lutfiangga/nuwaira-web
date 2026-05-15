import type { DataTableColumn } from '$lib/types/data-table';

export interface MaterialRow {
	id: string;
	classId: string;
	classCode?: string | null;
	classTitle?: string | null;
	title: string;
	materialType: string;
	orderNo: number;
	durationMinutes?: number | null;
	learningOutcome?: string | null;
	resourceUrl?: string | null;
	isRequired: boolean;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
}

export const materialColumns: DataTableColumn<MaterialRow>[] = [
	{
		id: 'select',
		type: 'select'
	},
	{
		accessorKey: 'classTitle',
		label: 'Class',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'title',
		label: 'Material',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'materialType',
		label: 'Type',
		sortable: true
	},
	{
		accessorKey: 'orderNo',
		label: 'Order',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'durationMinutes',
		label: 'Minutes',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'isRequired',
		label: 'Required',
		sortable: true,
		format: (value) => (value ? 'Yes' : 'No')
	},
	{
		id: 'actions',
		type: 'actions'
	}
];
