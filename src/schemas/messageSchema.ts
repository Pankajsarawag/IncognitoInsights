import {z} from 'zod';

export const messageSchema = z.object({
    message: z.string().min(10).max(400),
});