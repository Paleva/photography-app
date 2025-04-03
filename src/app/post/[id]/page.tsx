import { getPost } from '@/app/actions/feed/actions'

export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const postId = parseInt(id, 10)
    const { post, user, isVertical, liked, likesCount, userId } = await getPost(0, postId)

    if (!post) {
        return <div>Post not found</div>
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Post content goes here */}
            <h1>{post.title}</h1>
            <p>{post.id}</p>
        </div>
    )
}