'use client'

import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { MasonryGrid } from '@/components/layouts/masonry-grid'
import { ClientPostCard } from './postcard'
import { PostData } from '@/types/postdata'

const POSTS_PER_PAGE = 20

interface InfiniteFeedProps {
    initialPosts: any[]
    category?: string
    userId?: number
    getPosts: (limit?: number, offset?: number, userId?: number) => Promise<{
        posts: any[]
        hasMore: boolean
    }>
}

export function InfiniteFeedUser({ initialPosts, userId, getPosts }: InfiniteFeedProps) {

    const [posts, setPosts] = useState<PostData[]>(
        initialPosts.map((post) => ({
            ...post,
            instanceId: post.post.id
        })) || []
    )
    const [page, setPage] = useState(1) // Start at 1 since we already have the first page
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const gridRef = useRef<HTMLDivElement>(null)

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
    })

    // Distribute only the new posts evenly without affecting existing ones
    const distributeNewPostsEvenly = (newPosts: any[]) => {
        // Sort only the new posts by vertical/horizontal orientation
        return newPosts.sort((a, b) => {
            // Put vertical posts and horizontal posts in alternating order
            if (a.isVertical && !b.isVertical) return 1;
            if (!a.isVertical && b.isVertical) return -1;
            return 0;
        });
    };

    const loadMorePosts = async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const result = await getPosts(POSTS_PER_PAGE, page * POSTS_PER_PAGE, userId)


            // if (!result.posts.length || !result.hasMore) {
            //     setHasMore(false)
            // } else {
            // Add unique instanceId to each new post
            const postsWithUniqueIds = result.posts.map(post => ({
                ...post,
                instanceId: post.post.id
            }));

            // Only balance the new posts, then append them to existing posts
            const balancedNewPosts = distributeNewPostsEvenly(postsWithUniqueIds);
            setPosts((prev) => [...prev, ...balancedNewPosts]);
            setPage((prev) => prev + 1)
            setHasMore(result.hasMore && result.posts.length > 0)
            // }
        } catch (error) {
            console.error('Error loading more posts:', error)
        } finally {
            setIsLoading(false)
        }
    }


    // Load more posts when the user scrolls to the bottom
    useEffect(() => {
        if (inView) {
            loadMorePosts()
        }
    }, [inView])


    if (isLoading && posts.length === 0) {
        return (
            <div className="w-full flex justify-center my-12">
                <div className="h-8 w-8 rounded-full border-t-2 border-primary animate-spin"></div>
            </div>
        )
    }
    if (!posts.length && !isLoading) {
        return (
            <div className="w-full flex justify-center my-12">
                <p className="text-center text-gray-500 my-8">No photos to load</p>
            </div>
        )
    }

    return (
        <div ref={gridRef}>
            <MasonryGrid>
                {posts.map((postData) => (
                    // Use the instanceId as the key instead of just postData.id
                    <div key={postData.post.id} className="mb-6 hover:z-10 transition-all duration-300">
                        <ClientPostCard
                            post={postData.post}
                            user={postData.user}
                            liked={postData.liked}
                            userId={postData.userId}
                        />
                    </div>
                ))}
            </MasonryGrid>

            {/* Loading indicator */}
            <div ref={ref} className="w-full flex justify-center my-12">
                {isLoading && (
                    <div className="h-8 w-8 rounded-full border-t-2 border-primary animate-spin"></div>
                )}
            </div>

            {/* End message */}
            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500 my-8">No more photos to load</p>
            )}
        </div>
    )
}