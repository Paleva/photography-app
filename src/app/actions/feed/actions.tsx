'use server'

import { posts, db, users, likes } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { imageSizeFromFile } from 'image-size/fromFile'
import path from 'path'
import { countLikes, getLiked } from './like-actions'
import { verifySession } from '@/app/(public)/auth/session'

export async function getPostsIds(limit: number = 12, offset: number = 0): Promise<number[]> {
    try {
        const results = await db
            .select({ id: posts.id })
            .from(posts)
            .orderBy(desc(posts.uploaded_at))
            .limit(limit)
            .offset(offset)

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
            .from(posts)
            .where(eq(posts.user_id, userId))
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
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.user_id, userId))

        const postIds = results.map((post) => post.id)
        return postIds
    } catch (error) {
        console.error('Error fetching posts id:', error)
        return []
    }
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

        const postIds = results.map((like) => like.post_id)
        return postIds
    } catch (e) {
        console.error("Failed fetching liked posts id" + e)
        return []
    }
}

/**
 * @param {number} postId Id of the post to fetch
 * @param {number} userId User id of the user who is fetching the post
 * @returns The post and the associated info for it
 */
export async function getPost(userId: number, postId: number) {
    try {
        const results = await db
            .select({
                post: posts,
                user: {
                    id: users.id,
                    username: users.username,
                    profile_picture: users.profile_picture,
                },
            })
            .from(posts)
            .innerJoin(users, eq(posts.user_id, users.id))
            .where(eq(posts.id, postId))
            .limit(1);

        const { post, user } = results[0];
        const liked = await getLiked(userId, post.id)
        const likesCount = post.likes
        const isVertical = post.isvertical

        return { post, user, isVertical, liked, likesCount, userId }
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


export async function getUser(userId: number) {
    try {
        const results = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))

        return results[0]
    } catch {
        return null
    }
}


export async function getPaginatedPosts(limit: number = 12, offset: number = 0) {
    try {
        const { userId } = await verifySession()

        const postIds = await getPostsIds(limit, offset)

        const posts = await Promise.all(
            postIds.map(async (id) => {
                const postData = await getPost(userId || -1, id)
                return {
                    id,
                    ...postData
                }
            })
        )

        return {
            posts,
            hasMore: postIds.length === limit
        }
    }
    catch (error) {
        console.error('Error fetching paginated posts:', error)
        return {
            posts: [],
            hasMore: false
        }
    }
}
