
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