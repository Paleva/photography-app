import Loading from "@/app/(home)/loading"
import { ClientPostCard as PostCard } from "@/components/feed/postcard"
import { Suspense } from "react"
import { getLikedPostId } from "@/app/actions/feed/actions"
import { verifySession } from "@/app/(public)/auth/session"
import { MasonryGrid } from "@/components/layouts/masonry-grid"

export default async function LikedPage({ params }: { params: { user: string } }) {

    const session = await verifySession()

    if (!session.isAuth || !session.userId) {
        return <div>Not logged in</div>
    }

    const postIds = await getLikedPostId(session.userId)

    if (postIds?.length === 0) {
        return <div>No liked posts</div>
    } else if (postIds === undefined) {
        return <div>Failed to fetch liked posts</div>

    }
    console.log(postIds)
    return (
        <div className='p-4'>
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