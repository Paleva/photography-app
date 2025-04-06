import { Card, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPost } from "../../app/actions/feed/actions"
import Link from "next/link"
import { verifySession } from "@/app/(public)/auth/session"
import { Comments } from "./comments"
import { LikeButton } from "./LikeButton"


export async function PostCard({ id }: { id: number }) {
    const { userId } = await verifySession()
    const { post, user, liked } = await getPost(userId || -1, id);

    if (post.id === -1) {
        return (
            <Card key={id} className="overflow-hidden relative max-w-md mx-auto">
                <div className="w-full h-32 flex items-center justify-center bg-muted">
                    <p className="text-red-500 text-lg">Failed to fetch post</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="flex flex-row items-center justify-center">
            <Card key={id} className="overflow-hidden rounded-lg flex max-w-3xl max-h-[calc(100vh-6rem)] relative group">
                {/* Image container - takes up the entire card */}
                <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src={post.file_path}
                        width={post.isVertical ? 500 : 700}
                        height={post.isVertical ? 700 : 500}
                        className="object-contain  rounded-lg  "
                        alt={post.title || "Post image"}
                        priority
                    />

                    {/* Top gradient overlay - appears on hover */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-center text-white">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                {'profile_picture' in user && user.profile_picture ?
                                    <AvatarImage src={user.profile_picture} alt={user.username} />
                                    : null
                                }
                                <AvatarFallback className="bg-primary/20 text-primary">{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.username}</p>
                                <Link href="/[username]" as={`/${user.username}`}>
                                    <p className="text-sm text-white/70">@{user.username}</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient overlay - appears on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-white">
                        <div className="mb-3">
                            <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                            <p className="text-sm text-white/80 line-clamp-2">
                                {post.description}
                            </p>
                        </div>
                        {/* 
                    <PostCardFooter
                        postId={post.id}
                        userId={userId || -1}
                        initialLiked={liked}
                        initialLikes={likesCount || 0}
                    /> */}
                        <LikeButton
                            postId={post.id}
                            userId={userId || -1}
                            initialLiked={liked}
                            initialLikes={post.likes || 0} />
                    </div>
                </div>
            </Card>
            <div className="p-2 ">
                <Card className="max-h-[calc(100vh-6rem)]">
                    <CardTitle className="text-lg font-semibold p-2">Comments</CardTitle>
                    <Comments postId={post.id} userId={userId || -1} />
                </Card>
            </div>
        </div>
    )
}