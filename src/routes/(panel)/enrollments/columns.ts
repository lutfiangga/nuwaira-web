import type { DataTableColumn } from '$lib/types/data-table';

export interface EnrollmentRow {
	id: string;
	studentId: string;
	studentCode?: string | null;
	studentName?: string | null;
	classId: string;
	classCode?: string | null;
	classTitle?: string | null;
	enrollmentDate: Date | string | null;
	status: string;
	paymentStatus: string;
	finalScore?: number | null;
	notes?: string | null;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
}

export const enrollmentColumns: DataTableColumn<EnrollmentRow>[] = [
	{
		id: 'select',
		type: 'select'
	},
	{
		accessorKey: 'studentName',
		label: 'Student',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'classTitle',
		label: 'Class',
		sortable: true,
		searchable: true
	},
	{
		accessorKey: 'status',
		label: 'Enrollment',
		sortable: true
	},
	{
		accessorKey: 'paymentStatus',
		label: 'Payment',
		sortable: true
	},
	{
		accessorKey: 'finalScore',
		label: 'Final Score',
		type: 'number',
		sortable: true
	},
	{
		accessorKey: 'enrollmentDate',
		label: 'Enroll Date',
		type: 'date',
		sortable: true
	},
	{
		id: 'actions',
		type: 'actions'
	}
];
