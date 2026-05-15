import type { DataTableColumn } from '$lib/types/data-table';

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const categoryColumns: DataTableColumn<Category>[] = [
    {
        type: 'select',
        id: 'select',
    },
    {
        accessorKey: 'name',
        label: 'Category Name',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'description',
        label: 'Description',
        sortable: false,
        searchable: true
    },
    {
        accessorKey: 'createdAt',
        label: 'Created At',
        sortable: true,
        type: 'date'
    },
    {
        type: 'actions',
        id: 'actions'
    }
];
