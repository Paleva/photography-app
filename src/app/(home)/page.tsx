import { InfiniteFeed } from './infinite-feed'
import { getPaginatedPosts, } from '../actions/feed/actions'


export default async function Page() {

    const initialData = await getPaginatedPosts()

    return (
        <div>
            <InfiniteFeed initialPosts={initialData.posts} />
        </div>
    )
}

