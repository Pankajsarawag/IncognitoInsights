import { z } from "zod";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const resetPasswordSchema= z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(passwordPattern, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    newPasswordConfirmation: z.string()
        .min(8, "Confirm Password must be same as password and at least 8 characters long")
        .regex(passwordPattern, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
}).refine(data => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
});