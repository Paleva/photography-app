
import Loading from './loading'
import { verifySession } from '@/app/(public)/auth/session'
import { getPost } from '@/app/actions/feed/actions'
// import { DeletePostButton } from '@/components/feed/DeletePost'
import { PostCard } from '@/components/feed/post'
import { Suspense } from 'react'

export default async function PostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const postId = parseInt(id, 10)
    const session = await verifySession()
    const { post, user, liked, } = await getPost(session.userId, postId);

    if (post.id === -1) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-muted">
                <p className="text-red-500 text-lg">Post does not exist</p>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className='flex flex-col items-center justify-center'>
                <PostCard
                    post={post}
                    user={user}
                    liked={liked}
                    userId={session.userId} />
            </div>
        </Suspense>
    )
}