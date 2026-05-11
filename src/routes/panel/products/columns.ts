import type { DataTableColumn } from '$lib/types/data-table';

export interface Product {
    id: string;
    name: string;
    price: number;
    categoryId?: string | null;
    categoryName?: string | null;
    stock: number;
    images?: string[] | null;
    updatedAt: Date | string | null; // Adjusted to match schema return
}

export const productColumns: DataTableColumn<Product>[] = [
    {
        type: 'select',
        id: 'select',
    },
    {
        accessorKey: 'images',
        label: 'Images',
        type: 'image',
        sortable: false
    },
    {
        accessorKey: 'name',
        label: 'Product Name',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'categoryName',
        label: 'Category',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'price',
        label: 'Price',
        sortable: true,
        type: 'number',
        format: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    },
    {
        accessorKey: 'stock',
        label: 'Stock',
        sortable: true,
        type: 'number'
    },
    {
        accessorKey: 'updatedAt',
        label: 'Last Updated',
        sortable: true,
        type: 'date'
    },
    {
        type: 'actions',
        id: 'actions'
    }
];
