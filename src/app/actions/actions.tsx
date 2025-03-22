'use server'

import { photos, db, userTable, likes } from '@/db/schema'
import { eq, and, count, asc } from 'drizzle-orm'
import { imageSizeFromFile } from 'image-size/fromFile'
import path from 'path'
import { comments } from '@/db/schema'

export async function getAllPostsId(): Promise<number[]> {
    try {
        const results = await db.select({ id: photos.id }).from(photos)
        const postIds = results.map((post) => post.id)
        return postIds
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }

}


export async function getPostByUser(userId: number): Promise<any[]> {
    try {
        const results = await db
            .select()
            .from(photos)
            .where(eq(photos.user_id, userId))
            .limit(1)

        return results
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }
}

export async function getPostsByUserId(userId: number): Promise<number[]> {
    try {
        const results = await db
            .select({ id: photos.id })
            .from(photos)
            .where(eq(photos.user_id, userId))

        const postIds = results.map((post) => post.id)
        return postIds
    } catch (error) {
        console.error('Error fetching posts id:', error)
        return []
    }
}

/**
 * @param postId Id of the post for which the likes are counted
 * @returns {number} Number of likes for the post
 */
export async function countLikes(postId: number): Promise<number> {
    try {
        const likeCount = await db.select({ count: count() }).from(likes).where(eq(likes.photo_id, postId))
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
    const liked = await db
        .select()
        .from(likes)
        .where(
            and(
                eq(likes.photo_id, photo_id),
                eq(likes.user_id, userId)
            )
        )
    return liked.length > 0
}

/** 
*   @param {number} userId is the id of the user
*   @return {number} Ids of the posts that are liked by the user
*/
export async function getLikedPostId(userId: number): Promise<number[]> {
    try {
        const results = await db
            .select()
            .from(likes)
            .where(eq(likes.user_id, userId))

        const postIds = results.map((like) => like.photo_id)
        return postIds
    } catch (e) {
        console.error("Failed fetching liked posts id" + e)
        return []
    }
}

export async function getLikedPost(postId: number, userId: number) {
    try {
        const results = await db
            .select({
                post: photos,
                user: {
                    id: userTable.id,
                    username: userTable.username
                }
            })
            .from(photos)
            .innerJoin(userTable, eq(photos.user_id, userTable.id))
            .where(eq(photos.id, postId))
            .limit(1)

        const { post, user } = results[0]
        const liked = await getLiked(userId, post.id)
        const likesCount = await countLikes(post.id)
        const dimension = await imageSizeFromFile(path.join(process.cwd(), "/public", post.file_path))
        const isVertical = dimension.height > dimension.width

        return { post, user, isVertical, liked, likesCount }
    } catch (e) {
        console.error("Error fetching liked post:" + e)
        return {
            post: {
                id: -1,
                file_path: '/placeholder-error-image.png',
                title: 'Failed to fetch post',
                description: 'This post failed to load. Please try again later.'
            },
            user: {
                username: 'Unknown',
                id: -1
            },
            isVertical: false,
            liked: false,
            likesCount: 0
        }
    }
}

export async function getPost(postId: number, userId: number) {
    try {
        const results = await db
            .select({
                post: photos,
                user: {
                    id: userTable.id,
                    username: userTable.username
                },
            })
            .from(photos)
            .innerJoin(userTable, eq(photos.user_id, userTable.id))
            .where(eq(photos.id, postId))
            .limit(1);

        const { post, user } = results[0];
        const liked = await getLiked(userId, post.id)
        const likes = await countLikes(post.id)
        const dimension = await imageSizeFromFile(path.join(process.cwd(), "/public", post.file_path))
        const isVertical = dimension.height > dimension.width

        return { post, user, isVertical, liked, likes }
    }
    catch (error) {
        console.error('Error fetching post:', error)
        return {
            post: {
                id: -1,
                file_path: '/placeholder-error-image.png',
                title: 'Failed to fetch post',
                description: 'This post failed to load. Please try again later.'
            },
            user: {
                username: 'Unknown',
                id: -1
            },
            isVertical: false,
            liked: false,
            likes: 0
        }
    }
}

export async function toggleLike(postId: number, userId: number) {
    try {
        const existingLike = await db.select()
            .from(likes)
            .where(
                and(
                    eq(likes.photo_id, postId),
                    eq(likes.user_id, userId)
                )
            )

        if (existingLike.length > 0) {
            await db.delete(likes)
                .where(
                    and(
                        eq(likes.photo_id, postId),
                        eq(likes.user_id, userId)
                    )
                )
            return false
        } else {
            await db.insert(likes).values({
                photo_id: postId,
                user_id: userId,
            })
            return true
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return null
    }
}

export async function getComments(postId: number) {
    try {
        const result = await db
            .select({
                id: comments.id,
                content: comments.content,
                created_at: comments.created_at,
                user: {
                    id: userTable.id,
                    username: userTable.username
                }
            })
            .from(comments)
            .innerJoin(userTable, eq(comments.user_id, userTable.id))
            .where(eq(comments.photo_id, postId))
            .orderBy(asc(comments.created_at))

        return result;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function addComment(postId: number, userId: number, content: string) {
    try {
        if (!content.trim() || userId === -1) return null;

        const [result] = await db.insert(comments)
            .values({
                photo_id: postId,
                user_id: userId,
                content: content.trim(),
            })
            .returning();

        // Get the user info to return with the comment
        const user = await db
            .select({
                id: userTable.id,
                username: userTable.username
            })
            .from(userTable)
            .where(eq(userTable.id, userId))
            .limit(1);

        return { ...result, user: user[0] };
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
}