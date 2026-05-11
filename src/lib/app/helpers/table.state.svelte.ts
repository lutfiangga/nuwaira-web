// import type { ColumnStats } from '$lib/types/data-table';

export class TableState<T = any> {
    visibleColumns = $state<Record<string, boolean>>({});
    searchValue = $state('');
    activeSearchTerm = $state('');
    selectedRows = $state<Record<string, boolean>>({});
    sortColumn = $state('id');
    sortOrder = $state<'asc' | 'desc'>('asc');

    constructor(initialColumns: any[]) {
        this.visibleColumns = initialColumns.reduce(
            (acc, col) => {
                const key = col.accessorKey || col.id;
                if (key && col.type !== 'select' && col.type !== 'actions') {
                    acc[key] = !col.hidden;
                }
                return acc;
            },
            {} as Record<string, boolean>
        );
    }

    applySearch = () => {
        this.activeSearchTerm = this.searchValue;
    };

    clearSearch = () => {
        this.searchValue = '';
        this.activeSearchTerm = '';
    };

    toggleColumn = (col: string) => {
        this.visibleColumns = { ...this.visibleColumns, [col]: !this.visibleColumns[col] };
    };

    setSort = (column: string) => {
        if (this.sortColumn === column) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortOrder = 'asc';
        }
    };
}
