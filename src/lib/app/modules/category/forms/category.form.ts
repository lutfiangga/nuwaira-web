
import type { FormSchema } from '$lib/types/form-builder';

export const categorySchema: FormSchema = [
    {
        type: 'grid',
        columns: 1,
        children: [
            { name: 'name', label: 'Category Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]
    }
];
