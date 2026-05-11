
import type { FormSchema } from '$lib/types/form-builder';

export const getMenuSchema = (): FormSchema => [
    {
        type: 'section',
        title: 'Menu Item Details',
        description: 'Information about the food or beverage.',
        children: [
            {
                name: 'images',
                label: 'Menu Images',
                type: 'file',
                accept: 'image/*',
                path: 'uploads/menus',
                maxSize: 1024 * 1024 * 5, // 5MB max
                multiple: true
            },
            {
                name: 'name',
                label: 'Item Name',
                type: 'text',
                required: true,
                placeholder: 'e.g. Fried Rice Special'
            },
            {
                name: 'category',
                label: 'Category',
                type: 'select',
                required: true,
                options: [
                    { value: 'Food', label: 'Food' },
                    { value: 'Beverage', label: 'Beverage' }
                ]
            },
            {
                name: 'price',
                label: 'Price (IDR)',
                type: 'number',
                required: true,
                placeholder: '0'
            },
            {
                name: 'description',
                label: 'Description',
                type: 'textarea',
                required: true,
                placeholder: 'Describe the taste and ingredients...'
            }
        ]
    }
];
