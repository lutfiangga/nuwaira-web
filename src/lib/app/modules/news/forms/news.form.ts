
import type { FormSchema } from '$lib/types/form-builder';

export const getNewsSchema = (): FormSchema => [
    {
        type: 'section',
        title: 'Article Details',
        children: [
            {
                type: 'grid',
                columns: 2,
                children: [
                    {
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter article title'
                    },
                    {
                        name: 'slug',
                        label: 'Slug',
                        type: 'text',
                        required: true,
                        placeholder: 'url-friendly-slug',
                        slugOrigin: 'title'
                    }
                ]
            },
            {
                name: 'thumbnail',
                label: 'Thumbnail Image',
                type: 'file',
                accept: 'image/*',
                path: 'uploads/news/thumbnails',
                maxSize: 1024 * 1024 * 2
            },
            {
                name: 'content',
                label: 'Content',
                type: 'rich-text',
                required: true,
                placeholder: 'Write your article here...'
            }
        ]
    }
];
