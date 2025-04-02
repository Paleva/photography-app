'use client'

import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { MasonryGrid } from '@/components/layouts/masonry-grid'
import { ClientPostCard } from '@/components/feed/postcard'
import { getPaginatedPostsUploads } from '@/app/actions/feed/actions'

const POSTS_PER_PAGE = 20

export function InfiniteFeed({ initialPosts }: { initialPosts: any[] }) {
    // Add instanceId to track unique instances of posts
    const [posts, setPosts] = useState<any[]>(initialPosts.map(post => ({
        ...post,
        instanceId: `${post.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    })))
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
            const result = await getPaginatedPostsUploads(POSTS_PER_PAGE, page * POSTS_PER_PAGE, posts[0]?.userId)

            if (!result.posts.length || !result.hasMore) {
                setHasMore(false)
            } else {
                // Add unique instanceId to each new post
                const postsWithUniqueIds = result.posts.map(post => ({
                    ...post,
                    instanceId: `${post.id}-${page}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
                }));

                // Only balance the new posts, then append them to existing posts
                const balancedNewPosts = distributeNewPostsEvenly(postsWithUniqueIds);
                setPosts((prev) => [...prev, ...balancedNewPosts]);
                setPage((prev) => prev + 1)
            }
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

    return (
        <div ref={gridRef}>
            <MasonryGrid>
                {posts.map((postData) => (
                    // Use the instanceId as the key instead of just postData.id
                    <div key={postData.instanceId || `${postData.id}-${Math.random()}`} className="mb-6 hover:z-10 transition-all duration-300">
                        <ClientPostCard
                            post={postData.post}
                            user={postData.user}
                            isVertical={postData.isVertical}
                            liked={postData.liked}
                            likesCount={postData.likesCount}
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