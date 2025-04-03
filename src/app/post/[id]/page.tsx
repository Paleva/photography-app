import { getPost } from '@/app/actions/feed/actions'
import { PostCard } from '@/components/feed/post'
export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const postId = parseInt(id, 10)
    console.log('Post ID:', postId)
    // const { post, user, isVertical, liked, likesCount, userId } = await getPost(1, postId)

    // if (!post) {
    //     return <div>Post not found</div>
    // }

    return (
        <PostCard id={postId}>
        </PostCard>
    )
}