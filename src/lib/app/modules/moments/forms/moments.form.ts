
import type { FormSchema } from '$lib/types/form-builder';

export const getMomentsSchema = (): FormSchema => [
    {
        type: 'section',
        title: 'Moment Details',
        description: 'Preserve your precious memories.',
        children: [
            {
                name: 'image',
                label: 'Main Photo',
                type: 'file',
                accept: 'image/*',
                path: 'uploads/moments',
                maxSize: 1024 * 1024 * 5, // 5MB max
                multiple: false // Single image
            },
            {
                name: 'title',
                label: 'Title',
                type: 'text',
                required: true,
                placeholder: 'e.g. Grand Opening'
            },
            {
                name: 'date',
                label: 'Date',
                type: 'text',
                required: true
            },
            {
                name: 'description',
                label: 'Story',
                type: 'textarea',
                required: true,
                placeholder: 'What happened on this day...'
            }
        ]
    }
];
