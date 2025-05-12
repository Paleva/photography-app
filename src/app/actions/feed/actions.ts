'use server'

import { posts, db, users, likes, categories } from '@/db/schema'
import { sql, eq, desc, and, SQL, getTableColumns } from 'drizzle-orm'
import { getLiked } from './like-actions'
import { verifySession } from '@/app/(public)/auth/session'


export async function getFeedPosts(
    limit: number = 20,
    offset: number = 0,
    options: {
        categoryName?: string;
        filterByUploaderId?: number; // For a specific user's uploads
        filterByLikedBySessionUser?: boolean; // True to get posts liked by the current session user
    } = {}
) {
    try {
        const session = await verifySession();
        const sessionUserId = session.userId;

        const conditions: SQL[] = [];
        let joinLikesForFiltering = false;

        if (options.categoryName) {
            const categoryResult = await db.select({ id: categories.id })
                .from(categories)
                .where(eq(categories.name, options.categoryName))
                .limit(1);
            if (categoryResult.length > 0) {
                conditions.push(eq(posts.category_id, categoryResult[0].id));
            } else {
                return { posts: [], hasMore: false };
            }
        }

        if (options.filterByUploaderId) {
            conditions.push(eq(posts.user_id, options.filterByUploaderId));
        }

        if (options.filterByLikedBySessionUser) {
            if (!sessionUserId) return { posts: [], hasMore: false };
            joinLikesForFiltering = true;
            conditions.push(eq(likes.user_id, sessionUserId));
        }

        // Build the query
        const queryBuilder = db
            .select({
                post: { ...getTableColumns(posts) },
                user: {
                    id: users.id,
                    username: users.username,
                    profile_picture: users.profile_picture,
                },
                category: { // Select category name directly
                    name: categories.name
                },
                likedBySessionUser: sessionUserId
                    ? sql<boolean>`EXISTS(SELECT 1 FROM ${likes} WHERE ${likes.post_id} = ${posts.id} AND ${likes.user_id} = ${sessionUserId})`.mapWith(Boolean)
                    : sql<boolean>`FALSE`.mapWith(Boolean),
            })
            .from(posts)
            .innerJoin(users, eq(posts.user_id, users.id))
            .innerJoin(categories, eq(posts.category_id, categories.id));

        //Hack to get rid of a TypeScript error
        const queryAfterLikesJoin = joinLikesForFiltering
            ? queryBuilder.innerJoin(likes, eq(posts.id, likes.post_id))
            : queryBuilder;

        // Apply the conditions to the query
        // If queryAfterLikesJoin is of a type that omits 'where', the error will occur on '.where(...)'
        const queryWithAllConditions = conditions.length > 0
            ? queryAfterLikesJoin.where(and(...conditions))
            : queryAfterLikesJoin;

        const results = await queryWithAllConditions
            .orderBy(desc(posts.uploaded_at))
            .limit(limit)
            .offset(offset);

        const formattedPosts = results.map(r => ({
            post: {
                id: r.post.id,
                file_path: r.post.file_path,
                title: r.post.title,
                description: r.post.description,
                likes: r.post.likes,
                isVertical: r.post.isvertical,
                category: r.category.name,
            },
            user: r.user,
            liked: r.likedBySessionUser,
            userId: session.userId,
        }));

        return {
            posts: formattedPosts,
            hasMore: formattedPosts.length === limit,
        };

    } catch (error) {
        console.error('Error fetching feed posts:', error);
        return { posts: [], hasMore: false };
    }
}

// Wrappers for the main functionality to simplify usage
export async function getFeedPostsLiked(limit?: number, offset?: number, options?: { categoryName?: string }) {
    const session = await verifySession()
    if (!session.userId) {
        return {
            posts: [],
            hasMore: false
        }
    }
    return getFeedPosts(limit, offset, {
        ...options,
        filterByLikedBySessionUser: true,
    })
}

export async function getFeedPostsBySessionUser(limit?: number, offset?: number, options?: { categoryName?: string }) {
    const session = await verifySession()
    if (!session.userId) {
        return {
            posts: [],
            hasMore: false
        }
    }
    return getFeedPosts(limit, offset, {
        ...options,
        filterByUploaderId: session.userId,
    })
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
                post: {
                    id: posts.id,
                    file_path: posts.file_path,
                    title: posts.title,
                    description: posts.description,
                    likes: posts.likes,
                    isVertical: posts.isvertical,
                    category: categories.name
                },
                user: {
                    id: users.id,
                    username: users.username,
                    profile_picture: users.profile_picture,
                },
            })
            .from(posts)
            .innerJoin(users, eq(posts.user_id, users.id))
            .innerJoin(categories, eq(posts.category_id, categories.id))
            .where(eq(posts.id, postId))
            .limit(1);

        const { post, user } = results[0];
        const liked = await getLiked(post.id)

        return { post, user, liked, userId }
    }
    catch (error) {
        console.error('Error fetching post:', error)
        return {
            post: {
                id: -1,
                file_path: '/placeholder-error-image.png',
                title: 'Failed to fetch post',
                description: 'This post failed to load. Please try again later.',
                likes: 0,
                isVertical: false,
                category: 'Unknown',
            },
            user: {
                id: -1,
                username: 'Unknown',
                profile_picture: '/placeholder-error-image.png',
            },
            liked: false,
            userId: -1
        }
    }
}


export async function getUser(userId: number) {
    try {
        const results = await db
            .select({
                id: users.id,
                username: users.username,
                bio: users.bio,
                profile_picture: users.profile_picture,
                role: users.role,
            })
            .from(users)
            .where(eq(users.id, userId))

        return results[0]
    } catch {
        return null
    }
}

export async function getCategories() {
    try {
        const results = await db
            .select()
            .from(categories)

        return results.map((category) => ({
            id: category.id,
            name: category.name
        }))
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}