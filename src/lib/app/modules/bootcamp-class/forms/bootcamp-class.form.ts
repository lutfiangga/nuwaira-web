import type { FormSchema } from '$lib/types/form-builder';

export const bootcampClassSchema: FormSchema = [
	{
		type: 'section',
		title: 'Class Overview',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'code',
						label: 'Class Code',
						type: 'text',
						required: true,
						placeholder: 'BC-FE-2026-01'
					},
					{
						name: 'title',
						label: 'Class Title',
						type: 'text',
						required: true,
						placeholder: 'Frontend Developer Bootcamp'
					},
					{
						name: 'level',
						label: 'Level',
						type: 'select',
						required: true,
						options: [
							{ value: 'beginner', label: 'Beginner' },
							{ value: 'intermediate', label: 'Intermediate' },
							{ value: 'advanced', label: 'Advanced' }
						]
					},
					{
						name: 'mode',
						label: 'Mode',
						type: 'select',
						required: true,
						options: [
							{ value: 'online', label: 'Online' },
							{ value: 'offline', label: 'Offline' },
							{ value: 'hybrid', label: 'Hybrid' }
						]
					},
					{
						name: 'mentorName',
						label: 'Mentor Name',
						type: 'text',
						placeholder: 'Nama mentor utama'
					},
					{
						name: 'status',
						label: 'Status',
						type: 'select',
						required: true,
						options: [
							{ value: 'draft', label: 'Draft' },
							{ value: 'open', label: 'Open' },
							{ value: 'running', label: 'Running' },
							{ value: 'finished', label: 'Finished' },
							{ value: 'archived', label: 'Archived' }
						]
					}
				]
			}
		]
	},
	{
		type: 'section',
		title: 'Schedule & Pricing',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'durationWeeks',
						label: 'Duration (Weeks)',
						type: 'number',
						required: true,
						min: 1
					},
					{
						name: 'totalSessions',
						label: 'Total Sessions',
						type: 'number',
						required: true,
						min: 1
					},
					{
						name: 'price',
						label: 'Price',
						type: 'number',
						required: true,
						min: 0
					},
					{
						name: 'startDate',
						label: 'Start Date',
						type: 'text',
						placeholder: 'YYYY-MM-DD'
					},
					{
						name: 'endDate',
						label: 'End Date',
						type: 'text',
						placeholder: 'YYYY-MM-DD'
					}
				]
			}
		]
	},
	{
		type: 'section',
		title: 'Description',
		children: [
			{
				name: 'description',
				label: 'Class Description',
				type: 'textarea',
				placeholder: 'Tujuan, output, dan ringkasan kurikulum kelas'
			}
		]
	}
];
