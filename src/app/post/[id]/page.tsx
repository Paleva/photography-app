
import Loading from './loading'
import { verifySession } from '@/app/(public)/auth/session'
import { getPost } from '@/app/actions/feed/actions'
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

    return (
        <PostCard
            post={post}
            user={user}
            liked={liked}
            userId={session.userId} />
    )
}