import type { DataTableColumn } from '$lib/types/data-table';

export const milestoneDisplayColumns: DataTableColumn[] = [
	{ id: 'select', type: 'select', sortable: false },
	{ accessorKey: 'title', label: 'Milestone', sortable: true, searchable: true },
	{ accessorKey: 'programTitle', label: 'Program', sortable: true, searchable: true },
	{ accessorKey: 'weeks', label: 'Weeks', sortable: true },
	{ accessorKey: 'position', label: 'Position', type: 'number', sortable: true },
	{ accessorKey: 'icon', label: 'Icon', sortable: true, customCell: true },
	{ id: 'actions', type: 'actions', sortable: false }
];

export const milestoneExportColumns: DataTableColumn[] = [
	{ accessorKey: 'title', label: 'Milestone' },
	{ accessorKey: 'programTitle', label: 'Program' },
	{ accessorKey: 'weeks', label: 'Weeks' },
	{ accessorKey: 'position', label: 'Position' },
	{ accessorKey: 'icon', label: 'Icon' }
];
