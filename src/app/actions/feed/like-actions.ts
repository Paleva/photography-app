'use server'

import { eq, and } from 'drizzle-orm'
import { likes, db } from '@/db/schema'
import { verifySession } from '@/app/(public)/auth/session'


/**
 * @param userId Id of the user which is used to check if the user liked the post
 * @param photo_id Id of the post for which the like status is checked
 * @returns {boolean} True if the user liked the post, false otherwise
 */
export async function getLiked(photo_id: number): Promise<boolean> {

    const session = await verifySession()

    if (!session.isAuth) {
        return false
    }

    const liked = await db
        .select()
        .from(likes)
        .where(
            and(
                eq(likes.post_id, photo_id),
                eq(likes.user_id, session.userId)
            )
        )
    return liked.length > 0
}

/**
 * @param postId Id of the post for which the like status is toggled
 * @param userId Id of the user who is toggling the like
 * @returns The new like status of the post
 */
export async function toggleLike(postId: number) {

    const session = await verifySession()

    if (!session.isAuth) {
        return false
    }

    try {
        const existingLike = await db.select()
            .from(likes)
            .where(
                and(
                    eq(likes.post_id, postId),
                    eq(likes.user_id, session.userId)
                )
            )

        if (existingLike.length > 0) {
            await db.delete(likes)
                .where(
                    and(
                        eq(likes.post_id, postId),
                        eq(likes.user_id, session.userId)
                    )
                )
            return false
        } else {
            await db.insert(likes).values({
                post_id: postId,
                user_id: session.userId,
            })
            return true
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return null
    }
}