import type { DataTableColumn } from '$lib/types/data-table';

export const enrollmentDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ id: 'student', label: 'Student', sortable: false, customCell: true },
	{ accessorKey: 'programTitle', label: 'Program', sortable: true, searchable: true },
	{ accessorKey: 'offeringName', label: 'Offering', sortable: true },
	{ accessorKey: 'batchTitle', label: 'Batch', sortable: false, customCell: true },
	{ accessorKey: 'status', label: 'Status', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const enrollmentExportColumns: DataTableColumn[] = [
	{ accessorKey: 'studentName', label: 'Student' },
	{ accessorKey: 'email', label: 'Email' },
	{ accessorKey: 'programTitle', label: 'Program' },
	{ accessorKey: 'offeringName', label: 'Offering' },
	{ accessorKey: 'batchTitle', label: 'Batch' },
	{ accessorKey: 'status', label: 'Status' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
