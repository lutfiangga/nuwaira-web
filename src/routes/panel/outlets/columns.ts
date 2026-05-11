import type { DataTableColumn } from '$lib/types/data-table';

export interface Outlet {
    id: string;
    name: string;
    address?: string | null;
    province?: string | null;
    city?: string | null;
    district?: string | null;
    location?: string; // Combined location string
    latitude?: number | null;
    longitude?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const outletColumns: DataTableColumn<Outlet>[] = [
    {
        type: 'select',
        id: 'select',
    },
    {
        accessorKey: 'name',
        label: 'Outlet Name',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'location',
        label: 'Location',
        sortable: false,
        searchable: true
    },
    {
        accessorKey: 'address',
        label: 'Address',
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
