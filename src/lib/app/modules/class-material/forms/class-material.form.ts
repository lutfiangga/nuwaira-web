import type { FormSchema } from '$lib/types/form-builder';

export const getClassMaterialSchema = (
	classOptions: { value: string; label: string }[]
): FormSchema => [
	{
		type: 'section',
		title: 'Class Material',
		children: [
			{
				type: 'grid',
				columns: 2,
				children: [
					{
						name: 'classId',
						label: 'Class',
						type: 'select',
						required: true,
						options: classOptions
					},
					{
						name: 'materialType',
						label: 'Material Type',
						type: 'select',
						required: true,
						options: [
							{ value: 'topic', label: 'Topic' },
							{ value: 'practice', label: 'Practice' },
							{ value: 'project', label: 'Project' },
							{ value: 'assessment', label: 'Assessment' }
						]
					},
					{
						name: 'title',
						label: 'Material Title',
						type: 'text',
						required: true,
						placeholder: 'Contoh: React State Management'
					},
					{
						name: 'orderNo',
						label: 'Order',
						type: 'number',
						required: true,
						min: 1
					},
					{
						name: 'durationMinutes',
						label: 'Duration (Minutes)',
						type: 'number',
						min: 1
					},
					{
						name: 'resourceUrl',
						label: 'Resource URL',
						type: 'text',
						placeholder: 'https://...'
					}
				]
			},
			{
				name: 'learningOutcome',
				label: 'Learning Outcome',
				type: 'textarea',
				placeholder: 'Kompetensi yang akan dicapai siswa'
			},
			{
				name: 'isRequired',
				label: 'Mandatory Material',
				type: 'switch',
				description: 'Aktifkan jika materi wajib diselesaikan semua siswa.'
			}
		]
	}
];
