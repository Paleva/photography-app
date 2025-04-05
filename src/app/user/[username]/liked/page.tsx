import { InfiniteFeed } from './infinite-feed'
import { getPaginatedPostsLiked, } from '@/app/actions/feed/actions'
import { verifySession } from '@/app/(public)/auth/session'

export default async function Page() {
    const { userId } = await verifySession()

    if (!userId) {
        return <div>Not logged in</div>
    }

    const initialData = await getPaginatedPostsLiked(12, 0, userId)

    return (
        <div className='p-2'>
            <InfiniteFeed initialPosts={initialData.posts} />
        </div>
    )
}

