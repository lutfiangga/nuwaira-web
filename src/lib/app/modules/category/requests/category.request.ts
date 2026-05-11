import { z } from 'zod';

export const CreateCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional()
});

export const UpdateCategorySchema = CreateCategorySchema.extend({
    id: z.string().min(1, "ID is required")
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
