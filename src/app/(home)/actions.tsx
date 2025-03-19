'use server'

import { photos, db, userTable, likes } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { imageSizeFromFile } from 'image-size/fromFile'
import path from 'path'


export async function countLikes(postId: number) {
    try {
        const likeCount = await db.select({ count: count() }).from(likes).where(eq(likes.photo_id, postId))
        return likeCount[0].count
    } catch (e) {
        console.error(e)
    }
}


export async function getLiked(user_id: number, photo_id: number) {
    const liked = await db.select().from(likes).where(and(eq(likes.photo_id, photo_id), eq(likes.user_id, user_id)))
    return liked.length > 0
}

export async function getPost(id: number) {
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
        const liked = await getLiked(user.id, post.id)
        const likes = await countLikes(post.id)
        const file_path = path.join(process.cwd(), "/public", post.file_path);
        const dimension = await imageSizeFromFile(file_path);
        const isVertical = dimension.height > dimension.width;

        return { post, user, isVertical, liked, likes };
    }
    catch (error) {
        console.error('Error fetching post:', error);
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
        // Check if the user already liked the post
        const existingLike = await db.select()
            .from(likes)
            .where(
                and(
                    eq(likes.photo_id, post_id),
                    eq(likes.user_id, user_id)
                )
            );

        if (existingLike.length > 0) {
            // Delete the like if it exists
            await db.delete(likes)
                .where(
                    and(
                        eq(likes.photo_id, post_id),
                        eq(likes.user_id, user_id)
                    )
                );
            return false; // Return false to indicate the post is now unliked
        } else {
            // Add a like if it doesn't exist
            await db.insert(likes).values({
                photo_id: post_id,
                user_id: user_id,
            });
            return true; // Return true to indicate the post is now liked
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        return null;
    }
}