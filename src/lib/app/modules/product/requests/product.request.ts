import { z } from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    images: z.array(z.instanceof(File)).optional(),
    image_path: z.string().optional().default('uploads/products')
});

export const UpdateProductSchema = z.object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    images: z.array(z.instanceof(File)).optional(),
    images_existing: z.array(z.string()).optional(), // URLs to keep
    images_deleted: z.array(z.string()).optional(),  // URLs to delete
    image_path: z.string().optional().default('uploads/products')
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
