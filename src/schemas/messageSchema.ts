import {z} from 'zod';

export const messageSchema = z.object({
    message: z.string().min(10,"Message must be at least 10 characters long").max(500, "Message cannot be longer than 500 characters"),
});