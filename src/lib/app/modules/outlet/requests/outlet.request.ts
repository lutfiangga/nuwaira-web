import { z } from 'zod';

export const CreateOutletSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().optional(),
    province: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable()
});

export const UpdateOutletSchema = CreateOutletSchema.extend({
    id: z.string().min(1, "ID is required")
});

export type CreateOutletDTO = z.infer<typeof CreateOutletSchema>;
export type UpdateOutletDTO = z.infer<typeof UpdateOutletSchema>;
