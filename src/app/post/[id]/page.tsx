
// TODO - Implement loading skeleton


import { verifySession } from '@/app/(public)/auth/session'
import { getPost } from '@/app/actions/feed/actions'
import { PostCard } from '@/components/feed/post'
export default async function PostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const postId = parseInt(id, 10)
    const session = await verifySession()
    const { post, user, liked, } = await getPost(session.userId || -1, postId);

    return (
        <PostCard
            post={post}
            user={user}
            liked={liked}
            userId={session.userId || -1} />
    )
}