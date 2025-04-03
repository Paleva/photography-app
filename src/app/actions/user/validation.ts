import { z } from 'zod';

export const ChangePasswordFormSchema = z.object({
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .trim(),
    repeatedPassword: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .trim(),
}).superRefine(({ password, repeatedPassword }, ctx) => {
    if (password !== repeatedPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ['repeatedPassword'], // This highlights the repeatedPassword field specifically
        });
    }
});

export type FormState =
    | {
        errors?: {
            password?: string[];
            repeatedPassword?: string[];
        };
        message?: string;
        success?: boolean;
    }
    | undefined;