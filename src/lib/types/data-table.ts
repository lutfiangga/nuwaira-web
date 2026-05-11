export interface DataItem {
    id: string;
    [key: string]: any;
}

export interface DataTableColumn<T = DataItem> {
    id?: string;
    accessorKey?: string;
    label?: string;
    hidden?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'actions' | 'password' | 'image';
    format?: (value: any, item: T) => string;
}

export interface DataTableConfig {
    searchableFields?: string[];
    initialSortColumn?: string;
    initialSortOrder?: 'asc' | 'desc';
    perPage?: number;
}

export interface FormField {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'file';
    required?: boolean;
    placeholder?: string;
    step?: string;
    options?: { label: string; value: string | number }[];
    value?: any; // Default or current value
}
