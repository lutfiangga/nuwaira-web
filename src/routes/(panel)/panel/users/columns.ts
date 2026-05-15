import type { DataTableColumn } from '$lib/types/data-table';

export const userColumns: DataTableColumn[] = [
  {
    id: 'select',
    type: 'select',
    sortable: false
  },
  {
    accessorKey: 'photo',
    label: 'Photo',
    type: 'image',
    sortable: false
  },
  {
    accessorKey: 'id',
    label: 'ID',
    sortable: true,
    hidden: true
  },
  {
    accessorKey: 'username',
    label: 'Username',
    sortable: true,
    searchable: true
  },
  {
    accessorKey: 'email',
    label: 'Email',
    sortable: true,
    searchable: true
  },
  {
    accessorKey: 'roleId',
    label: 'Role',
    sortable: true
  },
  {
    accessorKey: 'age',
    label: 'Age',
    type: 'number',
    sortable: true
  },
  {
    id: 'actions',
    type: 'actions',
    sortable: false
  }
];
