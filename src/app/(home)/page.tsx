import { getCategories, getPaginatedPosts } from '../actions/feed/actions'
import FeedContainer from '@/components/feed/FeedContainer'

export default async function Page() {

    const initialData = await getPaginatedPosts()
    const categories = await getCategories()
    const categoriesNames = categories.map((category: { name: string }) => category.name)

    if (!initialData) {
        const error = 'Failed to fetch posts:('
        return <div className='flex justify-center items-center'>{error}</div>
    }

    return (
        <FeedContainer
            initialPosts={initialData.posts}
            categories={categoriesNames}
            getPosts={getPaginatedPosts} // Placeholder for getPosts function
        />
    )
}

