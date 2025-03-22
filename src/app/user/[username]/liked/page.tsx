import Loading from "@/app/(home)/loading"
import { PostCard } from "./postcard"
import styles from "@/styles/masonry.module.css"
import { Suspense } from "react"
import { getLikedPostId } from "@/app/actions/feed/actions"
import { verifySession } from "@/app/(public)/auth/session"

export default async function LikedPage({ params }: { params: { user: string } }) {

    const { user } = await params
    const session = await verifySession()
    let userId: number = -1

    if (!session.userId) {
        return <div>Not logged in</div>
    } else {
        userId = session.userId
    }

    const postIds = await getLikedPostId(userId)

    if (postIds?.length === 0) {
        return <div>No liked posts</div>
    } else if (postIds === undefined) {
        return <div>Failed to fetch liked posts</div>

    }
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