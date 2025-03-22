import { Suspense } from 'react'
import { PostCard } from '../../components/feed/postcard'
import Loading from './loading'
import styles from '@/styles/masonry.module.css'
import { getAllPostsId } from '../actions/actions'

export default async function Page() {

    const postIds = await getAllPostsId()
    return (
        <div className={`p-4 ${styles.masonry}`}>
            {postIds.map((index) => (
                <div key={index} className={styles.masonryItem}>
                    <Suspense fallback={<Loading />}>
                        <PostCard id={index} />
                    </Suspense>
                </div>
            ))}
        </div>
    )
}

