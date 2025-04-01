import { Suspense } from 'react'
import { InfiniteFeed } from './infinite-feed'
import Loading from './loading'
import { getPaginatedPosts, } from '../actions/feed/actions'
import { MasonryGrid } from '@/components/layouts/masonry-grid'

export default async function Page() {

    const initialData = await getPaginatedPosts()

    return (
        <div>
            <InfiniteFeed initialPosts={initialData.posts} />
            {/* <MasonryGrid>
                {postIds.map((index) => (
                    <div key={index} className="mb-6 hover:z-10 transition-all duration-300">
                        <Suspense fallback={<Loading />}>
                            <ClientPostCards id={index} />
                        </Suspense>
                    </div>
                ))}
            </MasonryGrid> */}
        </div>
    )
}

