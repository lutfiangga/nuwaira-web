import type { DataTableColumn } from '$lib/types/data-table';
import type { Moments } from '$lib/app/modules/moments/models/moments.schema';

export const momentsColumns: DataTableColumn<Moments>[] = [
    {
        accessorKey: 'title',
        label: 'Title',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'date',
        label: 'Date',
        sortable: true,
        type: 'date'
    },
    {
        accessorKey: 'description',
        label: 'Description',
        searchable: true
    }
];
