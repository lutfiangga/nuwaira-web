
import type { FormSchema } from '$lib/types/form-builder';

export const getProductSchema = (categoryOptions: { value: string; label: string }[]): FormSchema => [
    {
        type: 'section',
        title: 'Product Details',
        description: 'Essential information about the product.',
        children: [
            {
                name: 'images',
                label: 'Product Images',
                type: 'file',
                accept: 'image/*',
                path: 'uploads/products', // Store in this path
                maxSize: 1024 * 1024 * 5, // 5MB max
                multiple: true // Allow multiple
            },
            {
                name: 'name',
                label: 'Product Name',
                type: 'text',
                required: true,
                placeholder: 'e.g. Chocolate Shake'
            },
            {
                name: 'categoryId',
                label: 'Category',
                type: 'select',
                required: true,
                options: categoryOptions
            }
        ]
    },
    {
        type: 'section',
        title: 'Pricing & Inventory',
        children: [
            {
                type: 'grid',
                columns: 2,
                children: [
                    {
                        name: 'price',
                        label: 'Price',
                        type: 'number',
                        step: '0.01',
                        required: true,
                        placeholder: '0.00'
                    },
                    {
                        name: 'stock',
                        label: 'Stock Unit',
                        type: 'number',
                        required: true,
                        placeholder: '0'
                    }
                ]
            }
        ]
    }
];
