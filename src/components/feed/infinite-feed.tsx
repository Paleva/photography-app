'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { MasonryGrid } from '@/components/layouts/masonry-grid'
import { ClientPostCard } from './postcard'
import { PostData } from '@/types/postdata'

const POSTS_PER_PAGE = 20

interface InfiniteFeedProps {
    initialPosts: any[]
    category?: string
    getPosts: (limit?: number, offset?: number, options?: {
        categoryName?: string,
        filterByUploaderId?: number,
        filterByLikedSessionUser?: boolean,
    }) => Promise<{
        posts: any[]
        hasMore: boolean
    }>
}

export function InfiniteFeed({ initialPosts, category = '', getPosts }: InfiniteFeedProps) {
    const [posts, setPosts] = useState<PostData[]>(
        initialPosts.map((post) => ({
            ...post,
        })) || []
    )
    const [page, setPage] = useState(1) // Start at 1 since we already have the first page
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialPosts.length >= POSTS_PER_PAGE)
    const [previousCategory, setPreviousCategory] = useState<string>(category)


    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '400px',
    })

    // On category change
    useEffect(() => {
        if (previousCategory !== category) {
            setPosts([])
            setPage(1)
            setHasMore(true)
            setPreviousCategory(category)

            const loadInitialPostsForCategory = async () => {
                setIsLoading(true)
                try {
                    const result = await getPosts(POSTS_PER_PAGE, 0, category ? { categoryName: category } : {})
                    if (result.posts.length === 0 || !result.hasMore) {
                        setHasMore(false)
                        setIsLoading(false)
                    }
                    const posts = result.posts.map(post => ({
                        ...post,
                    }));
                    setPosts(posts)
                    setHasMore(result.hasMore)
                } catch (error) {
                    console.error('Error loading initial posts:', error)
                }
                finally {
                    setIsLoading(false)
                }
            }
            loadInitialPostsForCategory()
        }
    }, [category, getPosts])

    const loadMorePosts = async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const result = await getPosts(POSTS_PER_PAGE, page * POSTS_PER_PAGE, category ? { categoryName: category } : {})
            if (result.posts && result.posts.length > 0) {
                const posts = result.posts.map(post => ({
                    ...post,
                }));
                setPosts((prev) => [...prev, ...posts]);
                setPage((prev) => prev + 1)
            }
            setHasMore(result.hasMore)
        } catch (error) {
            console.error('Error loading more posts:', error)
            setHasMore(false)
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
        <div>
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