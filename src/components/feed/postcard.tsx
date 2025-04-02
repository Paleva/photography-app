'use client'

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCardFooter } from "@/components/feed/PostcardFooter"
import Link from "next/link"

// Define the props type based on what getPost returns
interface ClientPostCardProps {
    post: {
        id: number
        file_path: string
        title: string
        description: string
    }
    user: {
        id: number
        username: string
        profile_picture?: string
    }
    isVertical: boolean
    liked: boolean
    likesCount: number
    userId: number
}

export function ClientPostCard({
    post,
    user,
    isVertical,
    liked,
    likesCount,
    userId
}: ClientPostCardProps) {
    if (post.id === -1) {
        return (
            <Card className="overflow-hidden relative">
                <div className="w-full flex items-center justify-center bg-muted">
                    <p className="text-red-500 text-lg">Failed to fetch post</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden relative group rounded-lg">
            {/* Image container */}
            <div>
                <Image
                    src={post.file_path}
                    width={500}
                    height={isVertical ? 700 : 500}
                    className="w-full h-full object-cover rounded-lg"
                    alt={post.title || "Post image"}
                    priority
                />

                {/* Top gradient overlay */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-center text-white">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            {user.profile_picture ? (
                                <AvatarImage src={user.profile_picture} alt={user.username} />
                            ) : null}
                            <AvatarFallback className="bg-primary/20 text-primary">{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.username}</p>
                            <Link href={`/${user.username}`}>
                                <p className="text-sm text-white/70">@{user.username}</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-white">
                    <div className="mb-3">
                        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                        <p className="text-sm text-white/80 line-clamp-2">
                            {post.description}
                        </p>
                    </div>

                    <PostCardFooter
                        postId={post.id}
                        userId={userId}
                        initialLiked={liked}
                        initialLikes={likesCount}
                    />
                </div>
            </div>
        </Card>
    )
}