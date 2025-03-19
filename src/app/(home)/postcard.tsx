import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { verifySession } from "../(public)/auth/session"
import { getPost } from "./actions"
// import { LikeButton } from "./like-button"
// import { CommentButton } from "./comment-button"
import { PostCardFooter } from "./postcard-footer"

export async function PostCard({ id }: { id: number }) {
    const user_id = await verifySession()
    const { post, user, isVertical, liked, likes } = await getPost(id, user_id.userId || -1);
    // console.log(liked, user_id, likes)

    if (post.id === -1) {
        return (
            <Card key={id} className="overflow-hidden flex flex-col h-full">
                <CardHeader className="text-red-500 pb-2 text-2xl">Failed to fetch post</CardHeader>
                <CardContent>
                    <div className="w-full h-auto relative">
                        <Image
                            src={"/placeholder-error-image.png"}
                            width={500}
                            height={800}
                            className="w-full h-auto object-cover"
                            alt="post image"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card key={id} className="overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative">
                {isVertical ? (
                    // Vertical image container - taller with natural height
                    <div className="w-full h-auto relative">
                        <Image
                            src={post.file_path}
                            width={500}
                            height={800}
                            className="w-full h-auto object-cover"
                            alt="post image"
                            priority
                        />
                    </div>
                ) : (
                    // Horizontal image container
                    <div className="w-full relative">
                        <Image
                            src={post.file_path}
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover"
                            alt="post image"
                            priority
                        />
                    </div>
                )}
            </CardContent>

            <div className="p-4 flex-grow">
                <a href="#" className="block">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                </a>
                <CardDescription className="text-sm line-clamp-3">
                    {post.description}
                </CardDescription>
            </div>

            <PostCardFooter
                postId={post.id}
                userId={user_id.userId || -1}
                initialLiked={liked}
                initialLikes={likes || 0}
            />
        </Card >

    )
}

