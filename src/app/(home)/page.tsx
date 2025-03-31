import { Suspense } from 'react'
import { PostCard } from '../../components/feed/postcard'
import Loading from './loading'
import { getAllPostsId } from '../actions/feed/actions'
import { MasonryGrid } from '@/components/layouts/masonry-grid'

export default async function Page() {

    const postIds = await getAllPostsId()

    return (
        <div>
            <MasonryGrid>
                {postIds.map((index) => (
                    <div key={index} className="mb-6 hover:z-10 transition-all duration-300">
                        <Suspense fallback={<Loading />}>
                            <PostCard id={index} />
                        </Suspense>
                    </div>
                ))}
            </MasonryGrid>
        </div>
    )
}

