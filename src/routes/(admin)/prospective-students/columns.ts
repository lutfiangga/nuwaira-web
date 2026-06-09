import type { DataTableColumn } from '$lib/types/data-table';

export const prospectiveDisplayColumns: DataTableColumn[] = [
	{ id: 'student', label: 'Calon siswa', sortable: false, customCell: true },
	{ accessorKey: 'nik', label: 'NIK', sortable: false, headerClassName: 'w-36', customCell: true },
	{ id: 'contact', label: 'Kontak', sortable: false, customCell: true },
	{ id: 'domicile', label: 'Domisili', sortable: false, customCell: true },
	{ id: 'status', label: 'Status', sortable: false, headerClassName: 'w-24', customCell: true },
	{ id: 'actions', type: 'actions', sortable: false, headerClassName: 'w-36' }
];

export const prospectiveExportColumns: DataTableColumn[] = [
	{ accessorKey: 'fullName', label: 'Nama Lengkap' },
	{ accessorKey: 'nik', label: 'NIK' },
	{ accessorKey: 'email', label: 'Email' },
	{ accessorKey: 'whatsapp', label: 'WhatsApp' },
	{ accessorKey: 'regencyName', label: 'Kabupaten/Kota' },
	{ accessorKey: 'provinceName', label: 'Provinsi' },
	{ accessorKey: 'status', label: 'Status' }
];
