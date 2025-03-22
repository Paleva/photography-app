import { verifySession } from '@/app/(public)/auth/session'
import { getPostsByUserId } from '@/app/actions/feed/actions'
import { PostCard } from '@/components/feed/postcard'
import Loading from '@/app/(home)/loading'
import styles from '@/styles/masonry.module.css'
import { Suspense } from 'react'
export default async function UploadsPage({ params }: { params: { username: string } }) {

    const { username } = await params
    const session = await verifySession()
    if (!session.userId) {
        return <div>Please login</div>
    }

    const postIds = await getPostsByUserId(session.userId)
    console.log(postIds)

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