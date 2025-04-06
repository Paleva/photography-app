
// TODO - Implement loading skeleton
// TODO - rewrite this because it looks like shit and doesn't work properly half the time
// TODO - implement deleting action for user posts

import { PostCard } from '@/components/feed/post'
export default async function PostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const postId = parseInt(id, 10)

    return (
        <PostCard id={postId} />
    )
}