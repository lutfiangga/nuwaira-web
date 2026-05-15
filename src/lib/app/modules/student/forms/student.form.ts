import type { FormSchema } from '$lib/types/form-builder';

export const studentSchema: FormSchema = [
	{
		type: 'section',
		title: 'Data Siswa',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'studentCode',
						label: 'Student Code',
						type: 'text',
						required: true,
						placeholder: 'STU-2026-001'
					},
					{
						name: 'fullName',
						label: 'Full Name',
						type: 'text',
						required: true,
						placeholder: 'Nama lengkap'
					},
					{
						name: 'email',
						label: 'Email',
						type: 'email',
						required: true,
						placeholder: '[email protected]'
					},
					{
						name: 'phone',
						label: 'Phone',
						type: 'text',
						placeholder: '08xxxxxxxxxx'
					},
					{
						name: 'gender',
						label: 'Gender',
						type: 'select',
						required: true,
						options: [
							{ value: 'male', label: 'Male' },
							{ value: 'female', label: 'Female' },
							{ value: 'other', label: 'Other' }
						]
					},
					{
						name: 'track',
						label: 'Track',
						type: 'select',
						required: true,
						options: [
							{ value: 'personal', label: 'Personal' },
							{ value: 'business', label: 'Business' }
						]
					},
					{
						name: 'status',
						label: 'Status',
						type: 'select',
						required: true,
						options: [
							{ value: 'active', label: 'Active' },
							{ value: 'inactive', label: 'Inactive' },
							{ value: 'alumni', label: 'Alumni' }
						]
					}
				]
			}
		]
	},
	{
		type: 'section',
		title: 'Business Info',
		description: 'Isi jika siswa mengambil track business/corporate.',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'companyName',
						label: 'Company Name',
						type: 'text',
						placeholder: 'PT Contoh'
					},
					{
						name: 'jobTitle',
						label: 'Job Title',
						type: 'text',
						placeholder: 'Product Manager'
					},
					{
						name: 'billingContact',
						label: 'Billing Contact',
						type: 'text',
						placeholder: 'Nama PIC Finance'
					},
					{
						name: 'billingEmail',
						label: 'Billing Email',
						type: 'email',
						placeholder: '[email protected]'
					}
				]
			}
		]
	},
	{
		type: 'section',
		title: 'Notes',
		children: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Catatan tambahan' }]
	}
];
