import z from "zod"


export type UploadUserFormState =
    | {
        errors?: {
            file?: string[];
            username?: string[];
            bio?: string[];
            userId?: string[];
        };
        message?: string;
    }
    | undefined;

export type UploadPostFormState =
    | {
        errors?: {
            title?: string[];
            file?: string[];
            category?: string[];
            description?: string[];
        };
        message?: string;
    }
    | undefined;

export const uploadUserSchema = z.object({
    file: z.any()
        .optional()
        .refine(
            (file) => {
                if (file === undefined) return true
                if (file instanceof File && file.size === 0) return true
                const allowed = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]
                return (
                    file instanceof File &&
                    allowed.includes(file.type) &&
                    file.size > 0
                )
            },
            { message: "Invalid image file type. Supported .jpeg .jpg .png .gif .webp" }
        ).refine(
            (file) => file.size <= 5 * 1024 * 1024,
            { message: "File size must be less than 5MB" }
        ).nullable(),
    username: z.string().min(2, { message: "Username is required" }).trim(),
    bio: z.string().trim().nullable(),
    id: z.string().trim()
})

export const uploadPostSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    file: z.instanceof(File).refine(
        (file) =>
            [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/webp"
            ].includes(file.type),
        { message: "Invalid image file type. Supported .jpeg .jpg .png .gif .webp" }
    ).refine(
        (file) => file.size <= 5 * 1024 * 1024,
        { message: "File size must be less than 5MB" }
    ),
    category: z.string().trim(),
    description: z.string().trim().nullable()
})