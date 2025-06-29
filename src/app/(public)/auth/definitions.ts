import { z } from 'zod';

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(20, { message: 'Name must be at most 20 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .max(254, { message: 'Password must be at most 254 characters long.' })
        .trim(),
});

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z.string().min(1, { message: 'Password field must not be empty.' }).trim(),
});

export type FormState =
    | {
        errors?: {
            name?: string[];
            email?: string[];
            password?: string[];
        };
        message?: string;
    }
    | undefined;

export type SessionPayload = {
    userId: string | number;
    username: string;
    expiresAt: Date;
    role: string;
};