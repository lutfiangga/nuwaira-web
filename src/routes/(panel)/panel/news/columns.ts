import type { DataTableColumn } from '$lib/types/data-table';

export interface News {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const newsColumns: DataTableColumn<News>[] = [
    {
        type: 'select',
        id: 'select',
    },
    {
        accessorKey: 'thumbnail',
        label: 'Thumbnail',
        type: 'image',
        sortable: false
    },
    {
        accessorKey: 'title',
        label: 'Title',
        sortable: true,
        searchable: true
    },
    {
        accessorKey: 'slug',
        label: 'Slug',
        sortable: true,
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
