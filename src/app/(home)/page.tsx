import { Suspense } from 'react'
import { PostCard } from './postcard'
import Loading from './loading'
import styles from '@/styles/masonry.module.css'

export default async function Page() {


    return (
        <div className={`p-4 ${styles.masonry}`}>
            {[...Array(14)].map((_, index) => (
                <div key={index + 1} className={styles.masonryItem}>
                    <Suspense fallback={<Loading />}>
                        <PostCard id={index + 1} />
                    </Suspense>
                </div>
            ))}
        </div>
    )
}

