import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(1, "Password is required"),
    age: z.coerce.number().optional().nullable(),
    photo: z.instanceof(File).optional(),
    photo_path: z.string().optional().default('uploads/users')
});

export const UpdateUserSchema = z.object({
    id: z.string(),
    username: z.string().min(1, "Username is required"),
    password: z.string().optional().nullable(),
    age: z.coerce.number().optional().nullable(),
    photo: z.instanceof(File).optional(),
    photo_path: z.string().optional().default('uploads/users')
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
