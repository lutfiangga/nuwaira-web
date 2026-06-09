import type { DataTableColumn } from '$lib/types/data-table';

export const studentDisplayColumns: DataTableColumn[] = [
	{ id: 'student', label: 'Siswa', sortable: false, headerClassName: 'max-w-[200px]', customCell: true },
	{ accessorKey: 'nik', label: 'NIK', sortable: false, headerClassName: 'w-36', customCell: true },
	{ id: 'contact', label: 'Kontak', sortable: false, customCell: true },
	{ id: 'domicile', label: 'Domisili', sortable: false, customCell: true },
	{ id: 'education', accessorKey: 'activeEducation', label: 'Pendidikan', sortable: false, customCell: true },
	{ id: 'status', label: 'Status', sortable: false, headerClassName: 'w-24', customCell: true },
	{ id: 'actions', type: 'actions', sortable: false, headerClassName: 'w-28' }
];

export const studentExportColumns: DataTableColumn[] = [
	{ accessorKey: 'fullName', label: 'Nama Siswa' },
	{ accessorKey: 'nik', label: 'NIK' },
	{ accessorKey: 'email', label: 'Email' },
	{ accessorKey: 'whatsapp', label: 'WhatsApp' },
	{ accessorKey: 'regencyName', label: 'Kabupaten/Kota' },
	{ accessorKey: 'provinceName', label: 'Provinsi' },
	{ accessorKey: 'activeEducation', label: 'Pendidikan' },
	{ accessorKey: 'status', label: 'Status' }
];
