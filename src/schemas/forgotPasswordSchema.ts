import {z} from 'zod';

export const forgotPasswordSchema = z.object({
    identifier: z.string().min(2,"Required Field"),
});