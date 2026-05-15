// Generic types untuk data table yang reusable
export type SortOrder = 'asc' | 'desc';

export interface DataTableColumn {
  id?: string;
  accessorKey?: string; // key in data
  label?: string; // header text
  sortable?: boolean;

  // Type untuk formatting default
  type?: 'text' | 'number' | 'password' | 'date' | 'select' | 'actions';

  // Custom formatting function (optional)
  format?: (value: any, row?: any) => string;

  // Visibility defaults
  hidden?: boolean;
}

export interface DataTableConfig {
  columns: DataTableColumn[];
  searchableFields?: string[];
  updateAction?: string;
  deleteAction?: string;
  bulkDeleteAction?: string;
}

// Model User
export interface User {
  id: string;
  username: string;
  passwordHash?: string;
  age?: number;
}

// Generic item type
export type DataItem = Record<string, any> & { id: string };