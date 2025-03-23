import { Suspense } from 'react'
import { PostCard } from '../../components/feed/postcard'
import Loading from './loading'
import styles from '@/styles/masonry.module.css'
import { getAllPostsId } from '../actions/feed/actions'
import { MasonryGrid } from '@/components/layouts/masonry-grid'

export default async function Page() {

    const postIds = await getAllPostsId()

    return (
        <div className='p-4'>
            <MasonryGrid>
                {postIds.map((index) => (
                    <div key={index} className="mb-6 min-h-[300px] hover:z-10 transition-all duration-300">
                        <Suspense fallback={<Loading />}>
                            <PostCard id={index} />
                        </Suspense>
                    </div>
                ))}
            </MasonryGrid>
        </div>
    )
}

