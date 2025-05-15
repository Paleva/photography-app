'use client'

import { useState } from 'react'
import { InfiniteFeed } from '@/components/feed/infinite-feed'
import { PostData } from '@/types/postdata'
import CategorySelector from '@/components/feed/CategorySelector'

export default function FeedContainer({ initialPosts, categories, getPosts }: {
    initialPosts: PostData[]
    categories: string[]
    getPosts: (limit?: number, offset?: number, options?: {
        categoryName?: string,
        filterByUploaderId?: number,
        filterByLikedSessionUser?: boolean,
    }) => Promise<{
        posts: PostData[],
        hasMore: boolean
    }>
}) {
    const [category, setCategory] = useState<string>('')

    const handleCategoryChange = async (category: string) => {
        setCategory(category)
    }
    return (
        <div>
            <div>
                <CategorySelector categories={categories} onCategoryChange={handleCategoryChange} />
            </div>
            <div className='p-2'>
                <InfiniteFeed initialPosts={initialPosts} getPosts={getPosts} category={category} />
            </div>
        </div>
    )
}