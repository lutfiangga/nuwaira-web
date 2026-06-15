import type { FormSchema, SelectOption } from '$lib/types/form-builder';

const STATUS_OPTIONS: SelectOption[] = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'accepted', label: 'Accepted' },
	{ value: 'rejected', label: 'Rejected' },
	{ value: 'cancelled', label: 'Cancelled' },
	{ value: 'completed', label: 'Completed' }
];

export function getCreateEnrollmentFormSchema(
	studentOptions: SelectOption[],
	offeringOptions: SelectOption[],
	batchOptions: SelectOption[]
): FormSchema {
	return [
		{
			type: 'grid',
			columns: 1,
			children: [
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'studentId', label: 'Student', type: 'select', required: true, options: studentOptions },
						{ name: 'offeringId', label: 'Offering', type: 'select', required: true, options: offeringOptions }
					]
				},
				{ name: 'batchId', label: 'Batch', type: 'select', options: batchOptions },
				{ name: 'motivation', label: 'Motivation', type: 'textarea', required: true, rows: 3 },
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'referralSource', label: 'Referral Source', type: 'text', required: true, placeholder: 'Instagram, Teman, etc.' },
						{ name: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS }
					]
				},
				{
					type: 'grid',
					columns: 2,
					children: [
						{ name: 'hasProgrammingBasics', label: 'Has Programming Basics', type: 'switch' },
						{ name: 'usesAiTools', label: 'Uses AI Tools', type: 'switch' }
					]
				}
			]
		}
	];
}

export function getEditEnrollmentFormSchema(
	studentOptions: SelectOption[],
	offeringOptions: SelectOption[],
	batchOptions: SelectOption[]
): FormSchema {
	return getCreateEnrollmentFormSchema(studentOptions, offeringOptions, batchOptions);
}
