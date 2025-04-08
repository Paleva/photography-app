'use server'

import { verifySession } from "@/app/(public)/auth/session";
import { db, posts, comments, likes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { DeletePostFormState, deletePostFormSchema } from "./validation";

export async function deleteFunction(
    state: DeletePostFormState,
    formData: FormData
): Promise<DeletePostFormState> {
    const session = await verifySession()

    if (!session.isAuth || !session.userId) {
        return {
            error: "User not logged in",
            message: "Error while deleting post",
            success: false
        }
    }

    try {
        const validatedFields = deletePostFormSchema.safeParse({
            postId: formData.get('postId'),
        })
        console.log(validatedFields)
        if (!validatedFields.success) {
            return {
                error: "Error while deleting post. Try again later",
                message: "Error while deleting post",
                success: false
            }
        }

        const postId = parseInt(validatedFields.data.postId)

        await db.delete(likes).where(eq(likes.post_id, postId))
        await db.delete(comments).where(eq(comments.post_id, postId))
        await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.user_id, session.userId)))

        return {
            error: "",
            message: "Successfully deleted post",
            success: true
        }
    } catch (error) {
        console.log("Error while deleting post:" + error)
        return {
            error: "Something went wrong",
            message: "Error while deleting post",
            success: false
        }
    }

}