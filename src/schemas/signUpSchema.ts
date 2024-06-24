import {z} from 'zod';

export const userNameValidation = z.string().min(2).max(20).regex(/^[a-zA-Z0-9_]+$/);   

export const nameValidation = z.string().min(2).max(20);

export const signUpSchema = z.object({
    name: nameValidation,
    userName: userNameValidation,
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
});