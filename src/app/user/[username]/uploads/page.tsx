import { verifySession } from '@/app/(public)/auth/session'
import { getPostsByUserId } from '@/app/actions/feed/actions'
import { PostCard } from '@/components/feed/postcard'
import Loading from '@/app/(home)/loading'
import { Suspense } from 'react'
import { MasonryGrid } from '@/components/layouts/masonry-grid'

export default async function UploadsPage({ params }: { params: { username: string } }) {

    const session = await verifySession()
    if (!session.userId) {
        return <div>Please login</div>
    }

    const postIds = await getPostsByUserId(session.userId)

    return (
        <div className="p-4">
            <MasonryGrid>
                {postIds.map((index) => (
                    <div
                        key={index}
                        className="mb-6 min-h-[300px] hover:z-10 transition-all duration-300"
                    >
                        <Suspense fallback={<Loading />}>
                            <PostCard id={index} />
                        </Suspense>
                    </div>
                ))}
            </MasonryGrid>
        </div>
    )
}