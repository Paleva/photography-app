import { z } from 'zod';

export const DeleteAccountSchema = z.object({
    userId: z
        .string()
        .min(1, { message: 'User ID is required' })
        .regex(/^\d+$/, { message: 'User ID must be a number' })
        .transform((val) => parseInt(val, 10)),
});

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

export type DeleteFormState =
    | {
        message?: string;
        success?: boolean;
        error?: string;
    }
    | undefined;