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

    if (!session.isAuth) {
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

        if (!validatedFields.success) {
            return {
                error: "Error while deleting post. Try again later",
                message: "Error while deleting post",
                success: false
            }
        }

        const postId = parseInt(validatedFields.data.postId)

        const postUserId = await db.select({ id: posts.user_id }).from(posts).where(eq(posts.id, postId)).limit(1)

        if (postUserId.length === 0) {
            return {
                error: "Post not found",
                message: "Error while deleting post",
                success: false
            }
        }

        if (session.role === 'admin') {
            const user = await db.select({ id: posts.user_id }).from(posts).where(eq(posts.id, postId)).limit(1)
            await db.delete(likes).where(eq(likes.post_id, postId))
            await db.delete(comments).where(eq(comments.post_id, postId))
            await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.user_id, user[0].id)))
            return {
                error: "",
                message: "Successfully deleted post",
                success: true
            }
        }
        if (postUserId[0].id !== session.userId) {
            return {
                error: "You are not authorized to delete this post",
                message: "Error while deleting post",
                success: false
            }
        }

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