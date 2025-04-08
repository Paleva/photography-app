import { z } from 'zod'


export type DeletePostFormState =
    | {
        error?: string;
        message?: string;
        success?: boolean;
    }
    | undefined;


export const deletePostFormSchema = z.object({
    postId: z.string().min(1, { message: "Post ID is required" }),
})