'use client'

import { useState } from 'react'
import { InfiniteFeed } from '@/components/feed/infinite-feed'
import CategorySelector from '@/components/feed/CategorySelector'

// import { getCategories, getPaginatedPosts } from '@/app/actions/feed/actions'

export default function FeedContainer({ initialPosts, categories, getPosts }: {
    initialPosts: any[]
    categories: string[]
    getPosts: (limit?: number, offset?: number, category?: string, userId?: number) => Promise<{
        posts: any[],
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