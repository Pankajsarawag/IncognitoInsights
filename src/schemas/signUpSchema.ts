import { z } from 'zod';
export const nameValidation = z.string().min(1, "Name cannot be empty");

export const userNameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20).regex(/^[a-zA-Z0-9_]+$/, "Invalid character,  only letters, numbers, and underscores are allowed");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z.object({
    firstName: nameValidation,
    lastName: z.string(),
    username: userNameValidation,
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(passwordPattern, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    passwordConfirmation: z.string()
        .min(8, "Confirm Password must be same as password and at least 8 characters long")
        .regex(passwordPattern, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});



