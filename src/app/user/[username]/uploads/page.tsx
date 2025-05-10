import { getCategories, getFeedPostsBySessionUser } from '@/app/actions/feed/actions'
import { verifySession } from '@/app/(public)/auth/session'
import FeedContainer from '@/components/feed/FeedContainer'

export default async function Page() {
    const { userId } = await verifySession()

    if (!userId) {
        return <div>Not logged in</div>
    }

    const initialData = await getFeedPostsBySessionUser(20, 0)
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
            getPosts={getFeedPostsBySessionUser}
        />
    )
}
