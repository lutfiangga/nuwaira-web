import type { DataTableColumn } from '$lib/types/data-table';
import type { Menu } from '$lib/app/modules/menu/models/menu.schema';

export const menuColumns: DataTableColumn<Menu>[] = [
    {
        accessorKey: 'name',
        label: 'Name',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'category',
        label: 'Category',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'price',
        label: 'Price',
        sortable: true,
        type: 'number'
    },
    {
        accessorKey: 'description',
        label: 'Description',
        searchable: true
    }
];
