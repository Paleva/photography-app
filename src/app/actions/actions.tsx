'use server'

import { photos, db, userTable, likes } from '@/db/schema'
import { eq, and, count, asc } from 'drizzle-orm'
import { imageSizeFromFile } from 'image-size/fromFile'
import path from 'path'
import { comments } from '@/db/schema'


export async function countLikes(postId: number) {
    try {
        const likeCount = await db.select({ count: count() }).from(likes).where(eq(likes.photo_id, postId))
        return likeCount[0].count
    } catch (e) {
        console.error(e)
    }
}


export async function getLiked(user_id: number, photo_id: number) {
    const liked = await db
        .select()
        .from(likes)
        .where(
            and(
                eq(likes.photo_id, photo_id),
                eq(likes.user_id, user_id)
            )
        )
    return liked.length > 0
}

export async function getLikedPostId(user_id: number) {
    try {
        const results = await db
            .select()
            .from(likes)
            .where(eq(likes.user_id, user_id))

        const postIds = results.map((like) => like.photo_id)
        return postIds
    } catch (e) {
        console.error(e)
    }
}

export async function getLikedPost(id: number, user_id: number) {
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
            .where(eq(photos.id, id))
            .limit(1)

        const { post, user } = results[0]
        const liked = await getLiked(user_id, post.id)
        const likesCount = await countLikes(post.id)
        const dimension = await imageSizeFromFile(path.join(process.cwd(), "/public", post.file_path))
        const isVertical = dimension.height > dimension.width

        return { post, user, isVertical, liked, likesCount }
    } catch (e) {
        console.error(e)
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

export async function getPost(id: number, user_id: number) {
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
            .where(eq(photos.id, id))
            .limit(1);

        const { post, user } = results[0];
        const liked = await getLiked(user_id, post.id)
        const likes = await countLikes(post.id)
        const file_path = path.join(process.cwd(), "/public", post.file_path)
        const dimension = await imageSizeFromFile(file_path)
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

export async function toggleLike(post_id: number, user_id: number) {
    try {
        const existingLike = await db.select()
            .from(likes)
            .where(
                and(
                    eq(likes.photo_id, post_id),
                    eq(likes.user_id, user_id)
                )
            )

        if (existingLike.length > 0) {
            await db.delete(likes)
                .where(
                    and(
                        eq(likes.photo_id, post_id),
                        eq(likes.user_id, user_id)
                    )
                )
            return false
        } else {
            await db.insert(likes).values({
                photo_id: post_id,
                user_id: user_id,
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