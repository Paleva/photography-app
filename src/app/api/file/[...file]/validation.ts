import { z } from "zod";

// Define allowed file extensions
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

// Create a schema for file name validation
export const filePathSchema = z.object({
    file: z
        .array(z.string())
        .min(1, "File parameter is required")
        .refine(
            (files) => {
                // Get the file name from the path segments
                const fileName = files[0];

                // Check if it has an allowed extension
                const hasValidExtension = allowedExtensions.some(ext =>
                    fileName.toLowerCase().endsWith(ext)
                );

                return hasValidExtension;
            },
            {
                message: "Invalid file format. Supported formats: PNG, JPG, JPEG, GIF, WEBP",
            }
        )
        .refine(
            (files) => {
                // Check for potential path traversal attacks
                const fileName = files[0];
                return !fileName.includes("..") && !fileName.includes("/") && !fileName.includes("\\");
            },
            {
                message: "Invalid file path",
            }
        ),
});

// Helper function to validate file parameters
export function validateFileParams(params: { file: string[] }) {
    return filePathSchema.safeParse(params);
}