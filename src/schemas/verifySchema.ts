import {z} from 'zod';

export const verifySchema = z.object({
    verificationCode : z.string().length(6, "Code must be 6 characters long"),
});