import z from "zod"


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
    category: z.string(),
    description: z.string()
})