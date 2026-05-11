import { z } from 'zod';

export const UpdateProfileSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    age: z.coerce.number().optional().nullable(),
    photo: z.instanceof(File).optional(),
    photo_path: z.string().optional().default('uploads/users')
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;
