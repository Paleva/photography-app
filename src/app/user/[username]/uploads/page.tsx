import { InfiniteFeed } from './infinite-feed'
import { getPaginatedPostsUploads } from '@/app/actions/feed/actions'
import { verifySession } from '@/app/(public)/auth/session'

export default async function Page() {
    const { userId } = await verifySession()

    if (!userId) {
        return <div>Not logged in</div>
    }

    const initialData = await getPaginatedPostsUploads(20, 0, userId)

    return (
        <div className='p-2'>
            <InfiniteFeed initialPosts={initialData.posts} />
        </div>
    )
}
