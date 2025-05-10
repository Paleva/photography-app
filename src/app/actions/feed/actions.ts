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
                return { posts: [], hasMore: false }; // Category not found
            }
        }

        if (options.filterByUploaderId) {
            conditions.push(eq(posts.user_id, options.filterByUploaderId));
        }

        if (options.filterByLikedBySessionUser) {
            if (!sessionUserId) return { posts: [], hasMore: false }; // Must be logged in
            // This flag will indicate we need an INNER JOIN with likes table for filtering
            joinLikesForFiltering = true;
            conditions.push(eq(likes.user_id, sessionUserId));
        }

        let queryBuilder = db
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

        if (joinLikesForFiltering) {
            // Important: This join is for filtering the set of posts
            queryBuilder = queryBuilder.innerJoin(likes, eq(posts.id, likes.post_id));
        }
        if (conditions.length > 0) {
            queryBuilder = queryBuilder.where(and(...conditions));
        }

        const results = await queryBuilder
            .orderBy(desc(posts.uploaded_at))
            .limit(limit)
            .offset(offset);

        const formattedPosts = results.map(r => ({
            post: {
                id: r.post.id,
                file_path: r.post.file_path,
                title: r.post.title,
                description: r.post.description,
                likes: r.post.likes, // Total likes on the post
                isVertical: r.post.isvertical,
                category: r.category.name,
            },
            user: r.user,
            liked: r.likedBySessionUser, // Whether the session user liked this post
            userId: r.post.user_id, // The author of the post
        }));
        console.log('Fetched posts:', formattedPosts.map(p => p.liked));
        return {
            posts: formattedPosts,
            hasMore: formattedPosts.length === limit,
        };

    } catch (error) {
        console.error('Error fetching feed posts:', error);
        return { posts: [], hasMore: false };
    }
}

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

// export async function getPostsIdByCategoryId(categoryId: number, limit: number = 20, offset: number = 0, userId: number = -1, liked: boolean = false): Promise<number[]> {
//     try {
//         if (userId !== -1) {
//             if (liked) {
//                 const result = await db
//                     .select({ id: posts.id })
//                     .from(posts)
//                     .innerJoin(likes, eq(posts.id, likes.post_id))
//                     .where(and(eq(posts.category_id, categoryId), eq(likes.user_id, userId)))
//                     .orderBy(desc(posts.uploaded_at))
//                     .limit(limit)
//                     .offset(offset)
//                 const postIds = result.map((post) => post.id)
//                 return postIds
//             } else {
//                 const result = await db
//                     .select({ id: posts.id })
//                     .from(posts)
//                     .where(and(eq(posts.category_id, categoryId), eq(posts.user_id, userId)))
//                     .orderBy(desc(posts.uploaded_at))
//                     .limit(limit)
//                     .offset(offset)
//                 const postIds = result.map((post) => post.id)
//                 return postIds
//             }
//         } else {
//             const results = await db
//                 .select({ id: posts.id })
//                 .from(posts)
//                 .where(eq(posts.category_id, categoryId))
//                 .orderBy(desc(posts.uploaded_at))
//                 .limit(limit)
//                 .offset(offset)

//             const postIds = results.map((post) => post.id)
//             return postIds
//         }
//     }
//     catch (error) {
//         console.error('Error fetching posts:', error)
//         return []
//     }
// }

// export async function getPostsIds(limit: number = 20, offset: number = 0): Promise<number[]> {
//     try {
//         const results = await db
//             .select({ id: posts.id })
//             .from(posts)
//             .orderBy(desc(posts.uploaded_at))
//             .limit(limit)
//             .offset(offset)

//         const postIds = results.map((post) => post.id)
//         return postIds
//     } catch (error) {
//         console.error('Error fetching posts:', error)
//         return []
//     }
// }

// export async function getPostsIdByUserId(limit: number = 20, offset: number = 0, userId: number): Promise<number[]> {
//     try {
//         const results = await db
//             .select({ id: posts.id })
//             .from(posts)
//             .where(eq(posts.user_id, userId))
//             .orderBy(desc(posts.uploaded_at))
//             .limit(limit)
//             .offset(offset)

//         const postIds = results.map((post) => post.id)
//         return postIds
//     } catch (error) {
//         console.error('Error fetching posts id:', error)
//         return []
//     }
// }


// /** 
// *   @param {number} userId is the id of the user
// *   @return {number} Ids of the posts that are liked by the user
// */
// export async function getLikedPostId(limit: number = 20, offset: number = 0, userId: number): Promise<number[]> {
//     try {
//         const results = await db
//             .select()
//             .from(likes)
//             .where(eq(likes.user_id, userId))
//             .limit(limit)
//             .offset(offset)

//         const postIds = results.map((like) => like.post_id)
//         return postIds
//     } catch (e) {
//         console.error("Failed fetching liked posts id" + e)
//         return []
//     }
// }

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


// export async function getPaginatedPosts(limit: number = 20, offset: number = 0, category: string = '') {
//     try {

//         let postIds: number[] = []

//         if (category) {
//             const [categoryResult] = await db
//                 .select({ id: categories.id })
//                 .from(categories)
//                 .where(eq(categories.name, category))
//                 .limit(1)

//             postIds = await getPostsIdByCategoryId(categoryResult.id, limit, offset)
//         } else {
//             postIds = await getPostsIds(limit, offset)
//         }

//         const { userId } = await verifySession()

//         const posts = await Promise.all(
//             postIds.map(async (id) => {
//                 const postData = await getPost(userId, id)
//                 return {
//                     ...postData
//                 }
//             })
//         )

//         return {
//             posts,
//             hasMore: postIds.length === limit,
//         }
//     }
//     catch (error) {
//         console.error('Error fetching paginated posts:', error)
//         return {
//             posts: [],
//             hasMore: false
//         }
//     }
// }


// export async function getPaginatedPostsLiked(limit: number = 20, offset: number = 0, category: string = '') {
//     try {

//         const { userId } = await verifySession()
//         if (!userId) {
//             return {
//                 posts: [],
//                 hasMore: false
//             }
//         }

//         let postIds: number[] = []
//         if (category) {
//             const [categoryResult] = await db
//                 .select({ id: categories.id })
//                 .from(categories)
//                 .where(eq(categories.name, category))
//                 .limit(1)

//             postIds = await getPostsIdByCategoryId(categoryResult.id, limit, offset, userId, true)
//         } else {
//             postIds = await getLikedPostId(limit, offset, userId)
//         }


//         const posts = await Promise.all(
//             postIds.map(async (id) => {
//                 const postData = await getPost(userId, id)
//                 return {
//                     id,
//                     ...postData
//                 }
//             })
//         )

//         return {
//             posts,
//             userId,
//             hasMore: postIds.length === limit
//         }
//     }
//     catch (error) {
//         console.error('Error fetching paginated posts:', error)
//         return {
//             posts: [],
//             hasMore: false
//         }
//     }
// }


// export async function getPaginatedPostsUploads(limit: number = 20, offset: number = 0, category: string = '') {
//     try {

//         const { userId } = await verifySession()

//         if (!userId) {
//             return {
//                 posts: [],
//                 hasMore: false
//             }
//         }

//         let postIds: number[] = []

//         if (category) {
//             const [categoryResult] = await db
//                 .select({ id: categories.id })
//                 .from(categories)
//                 .where(eq(categories.name, category))
//                 .limit(1)

//             postIds = await getPostsIdByCategoryId(categoryResult.id, limit, offset, userId)
//             if (postIds.length === 0) {
//                 return {
//                     posts: [],
//                     hasMore: false
//                 }
//             }
//         } else {
//             postIds = await getPostsIdByUserId(limit, offset, userId)
//         }


//         const posts = await Promise.all(
//             postIds.map(async (id) => {
//                 const postData = await getPost(userId, id)
//                 return {
//                     id,
//                     ...postData
//                 }
//             })
//         )

//         return {
//             posts,
//             userId,
//             hasMore: postIds.length === limit
//         }
//     }
//     catch (error) {
//         console.error('Error fetching paginated posts:', error)
//         return {
//             posts: [],
//             hasMore: false
//         }
//     }
// }

// export async function getPaginatedPostsUser(limit: number = 20, offset: number = 0, userId: number = 0) {
//     try {

//         const postIds = await getPostsIdByUserId(limit, offset, userId)

//         const session = await verifySession()

//         const posts = await Promise.all(
//             postIds.map(async (id) => {
//                 const postData = await getPost(session.userId, id)
//                 return {
//                     id,
//                     ...postData
//                 }
//             })
//         )

//         return {
//             posts,
//             hasMore: postIds.length === limit,
//         }
//     } catch (error) {
//         console.log(error)
//         return {
//             posts: [],
//             hasMore: false
//         }
//     }
// }


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