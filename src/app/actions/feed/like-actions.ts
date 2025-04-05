'use server'

import { count, eq, and } from 'drizzle-orm'
import { likes, db } from '@/db/schema'

function authorize(userId: number) {
    if (!userId || userId === -1) {
        return false
    }
    return true
}

/**
 * @param postId Id of the post for which the likes are counted
 * @returns {number} Number of likes for the post
 */
export async function countLikes(postId: number): Promise<number> {
    try {
        const likeCount = await db.select({ count: count() }).from(likes).where(eq(likes.post_id, postId))
        return likeCount[0].count
    } catch (e) {
        console.error(e)
        return 0
    }
}

/**
 * @param userId Id of the user which is used to check if the user liked the post
 * @param photo_id Id of the post for which the like status is checked
 * @returns {boolean} True if the user liked the post, false otherwise
 */
export async function getLiked(userId: number, photo_id: number): Promise<boolean> {

    if (!authorize(userId)) {
        return false
    }

    const liked = await db
        .select()
        .from(likes)
        .where(
            and(
                eq(likes.post_id, photo_id),
                eq(likes.user_id, userId)
            )
        )
    return liked.length > 0
}

/**
 * @param postId Id of the post for which the like status is toggled
 * @param userId Id of the user who is toggling the like
 * @returns The new like status of the post
 */
export async function toggleLike(postId: number, userId: number) {

    if (!authorize(userId)) {
        return null
    }

    try {
        const existingLike = await db.select()
            .from(likes)
            .where(
                and(
                    eq(likes.post_id, postId),
                    eq(likes.user_id, userId)
                )
            )

        if (existingLike.length > 0) {
            await db.delete(likes)
                .where(
                    and(
                        eq(likes.post_id, postId),
                        eq(likes.user_id, userId)
                    )
                )
            return false
        } else {
            await db.insert(likes).values({
                post_id: postId,
                user_id: userId,
            })
            return true
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return null
    }
}