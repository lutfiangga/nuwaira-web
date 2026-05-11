export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export class ExportHelper {
    /**
     * Main export method with switch case for different formats
     */
    static export<T>(
        format: ExportFormat,
        data: T[],
        columns: any[],
        filename?: string
    ) {
        const baseFilename = filename || `export_${new Date().toISOString().split('T')[0]}`;

        switch (format) {
            case 'csv':
                this.exportCSV(data, columns, `${baseFilename}.csv`);
                break;
            case 'xlsx':
                this.exportXLSX(data, columns, `${baseFilename}.xlsx`);
                break;
            case 'pdf':
                this.exportPDF(data, columns, `${baseFilename}.pdf`);
                break;
            default:
                console.error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Get exportable columns (filter out select and actions)
     */
    private static getExportableColumns(columns: any[]) {
        return columns.filter(
            (col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions' && col.type !== 'image'
        );
    }

    /**
     * Extract data rows for export
     */
    private static extractRows<T>(data: T[], columns: any[]): string[][] {
        const exportableColumns = this.getExportableColumns(columns);
        return data.map((item: any) =>
            exportableColumns.map((col) => {
                const value = item[col.accessorKey!];
                if (value == null) return '';
                if (Array.isArray(value)) return value.join('; ');
                return String(value);
            })
        );
    }

    /**
     * Get headers for export
     */
    private static getHeaders(columns: any[]): string[] {
        return this.getExportableColumns(columns).map((col) => col.label || col.accessorKey);
    }

    /**
     * Export to CSV format
     */
    static exportCSV<T>(data: T[], columns: any[], filename: string = 'export.csv') {
        const headers = this.getHeaders(columns);
        const rows = this.extractRows(data, columns);

        // Escape CSV values properly
        const escapeCSV = (value: string) => {
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map((row) => row.map(escapeCSV).join(','))
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    }

    /**
     * Export to Excel format (using xlsx library if available, fallback to TSV)
     */
    static async exportXLSX<T>(data: T[], columns: any[], filename: string = 'export.xlsx') {
        const headers = this.getHeaders(columns);
        const rows = this.extractRows(data, columns);

        try {
            // Try to use xlsx library if available
            const XLSX = await import('xlsx');
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
            XLSX.writeFile(workbook, filename);
        } catch {
            // Fallback to tab-separated values
            console.warn('xlsx library not available, using TSV fallback');
            const content = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
            this.downloadFile(content, filename.replace('.xlsx', '.xls'), 'application/vnd.ms-excel');
        }
    }

    /**
     * Export to PDF format (using browser print or simple HTML table)
     */
    static exportPDF<T>(data: T[], columns: any[], filename: string = 'export.pdf') {
        const headers = this.getHeaders(columns);
        const rows = this.extractRows(data, columns);

        // Create printable HTML
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${filename}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { font-size: 18px; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f4f4f4; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    @media print {
                        body { margin: 0; }
                        @page { margin: 1cm; }
                    }
                </style>
            </head>
            <body>
                <h1>${filename.replace('.pdf', '')}</h1>
                <table>
                    <thead>
                        <tr>
                            ${headers.map((h) => `<th>${this.escapeHtml(h)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows
                .map(
                    (row) =>
                        `<tr>${row.map((cell) => `<td>${this.escapeHtml(cell)}</td>`).join('')}</tr>`
                )
                .join('')}
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    };
                </script>
            </body>
            </html>
        `;

        // Open in new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
        } else {
            console.error('Could not open print window. Please allow popups.');
            alert('Please allow popups to export as PDF');
        }
    }

    /**
     * Escape HTML special characters
     */
    private static escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Download file helper
     */
    private static downloadFile(content: string, filename: string, type: string) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
