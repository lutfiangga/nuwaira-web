import type { FormSchema } from '$lib/types/form-builder';

export const getEnrollmentSchema = (
	studentOptions: { value: string; label: string }[],
	classOptions: { value: string; label: string }[]
): FormSchema => [
	{
		type: 'section',
		title: 'Enrollment Data',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'studentId',
						label: 'Student',
						type: 'select',
						required: true,
						options: studentOptions
					},
					{
						name: 'classId',
						label: 'Class',
						type: 'select',
						required: true,
						options: classOptions
					},
					{
						name: 'status',
						label: 'Enrollment Status',
						type: 'select',
						required: true,
						options: [
							{ value: 'active', label: 'Active' },
							{ value: 'completed', label: 'Completed' },
							{ value: 'cancelled', label: 'Cancelled' },
							{ value: 'dropped', label: 'Dropped' }
						]
					},
					{
						name: 'paymentStatus',
						label: 'Payment Status',
						type: 'select',
						required: true,
						options: [
							{ value: 'pending', label: 'Pending' },
							{ value: 'partial', label: 'Partial' },
							{ value: 'paid', label: 'Paid' },
							{ value: 'refunded', label: 'Refunded' }
						]
					},
					{
						name: 'finalScore',
						label: 'Final Score',
						type: 'number',
						min: 0,
						max: 100,
						placeholder: '0 - 100'
					}
				]
			},
			{
				name: 'notes',
				label: 'Notes',
				type: 'textarea',
				placeholder: 'Catatan progres atau administrasi'
			}
		]
	}
];
