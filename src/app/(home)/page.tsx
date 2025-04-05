import { InfiniteFeed } from './infinite-feed'
import { getCategories, getPaginatedPosts } from '../actions/feed/actions'
import FeedContainer from '@/components/feed/FeedContainer'
import CategorySelector from '@/components/feed/CategorySelector'

export default async function Page() {

    const initialData = await getPaginatedPosts()
    const categories = await getCategories()
    const categoriesNames = categories.map((category: { name: string }) => category.name)


    return (
        <FeedContainer
            initialPosts={initialData.posts}
            categories={categoriesNames}
            getPosts={getPaginatedPosts}
        />
    )
}

