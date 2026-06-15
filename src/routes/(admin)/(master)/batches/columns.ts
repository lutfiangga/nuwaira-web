import type { DataTableColumn } from '$lib/types/data-table';

export const batchDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'title', label: 'Batch', sortable: true, searchable: true },
	{ accessorKey: 'programTitle', label: 'Program', sortable: true, searchable: true },
	{ accessorKey: 'offeringName', label: 'Offering', sortable: true },
	{ accessorKey: 'dayText', label: 'Hari', customCell: true },
	{ accessorKey: 'timeText', label: 'Jam', customCell: true },
	{ accessorKey: 'startDate', label: 'Periode', sortable: true, customCell: true },
	{ accessorKey: 'capacity', label: 'Capacity', type: 'number', sortable: true },
	{ accessorKey: 'isOpen', label: 'Status', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const batchExportColumns: DataTableColumn[] = [
	{ accessorKey: 'title', label: 'Batch' },
	{ accessorKey: 'programTitle', label: 'Program' },
	{ accessorKey: 'offeringName', label: 'Offering' },
	{ accessorKey: 'dayText', label: 'Hari' },
	{ accessorKey: 'timeText', label: 'Jam' },
	{ accessorKey: 'startDate', label: 'Start Date' },
	{ accessorKey: 'endDate', label: 'End Date' },
	{ accessorKey: 'isOpen', label: 'Status' },
	{ accessorKey: 'createdAt', label: 'Dibuat', type: 'date' }
];
