'use client'

import { Card, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Comments } from "./comments"
import { LikeButton } from "./LikeButton"
import { DeletePostButton } from "./DeletePost"
import { PostData } from "@/types/postdata"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"


export function PostCard({
    post,
    user,
    liked,
    userId,
    role
}: PostData) {

    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const isMobile = useIsMobile();
    const [hasTouchCapability, setHasTouchCapability] = useState(false);

    // Detect touch capability on component mount
    useEffect(() => {
        const touchCapability =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            (navigator as any).msMaxTouchPoints > 0;

        setHasTouchCapability(touchCapability);
    }, []);

    // We consider it a touch device if it's mobile OR it's a touch device without hover capability
    const isTouchDevice = isMobile || (hasTouchCapability && window.matchMedia('(hover: none)').matches);

    const handleCardClick = () => {
        if (isTouchDevice) {
            setIsOverlayVisible(prev => !prev);
        }
    };

    if (post.id === -1) {
        return (
            <Card className="overflow-hidden relative max-w-md mx-auto">
                <div className="w-full h-32 flex items-center justify-center bg-muted">
                    <p className="text-red-500 text-lg">Failed to fetch post</p>
                </div>
            </Card>
        )
    }

    // Determine overlay visibility based on device type and state
    const topOverlayClasses = isTouchDevice
        ? isOverlayVisible ? "opacity-100" : "opacity-0"
        : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100";

    const bottomOverlayClasses = isTouchDevice
        ? isOverlayVisible ? "opacity-100" : "opacity-0"
        : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100";

    // Determine if links should be interactive
    const linkInteractionClass = isTouchDevice && !isOverlayVisible ? "pointer-events-none" : "pointer-events-auto";

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-center">
                <div className="flex flex-col">
                    <Card className="overflow-hidden rounded-lg flex max-w-3xl max-h-[calc(100vh-6rem)] relative group">
                        {/* Image container - takes up the entire card */}
                        <div
                            className={`w-full h-full flex items-center justify-center ${isTouchDevice ? 'cursor-pointer' : ''}`}
                            onClick={handleCardClick}
                        >
                            <Image
                                src={post.file_path}
                                width={post.isVertical ? 500 : 700}
                                height={post.isVertical ? 700 : 500}
                                className="object-contain rounded-lg"
                                alt={post.title || "Post image"}
                                priority
                            />


                            {(!isTouchDevice || isOverlayVisible) && (
                                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-center text-white ${topOverlayClasses}`}>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            {user.profile_picture ?
                                                <AvatarImage src={user.profile_picture} alt={user.username} />
                                                : null
                                            }
                                            <AvatarFallback className="bg-primary/20 text-primary">{user.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.username}</p>
                                            <Link href="/[username]" as={`/${user.username}`} className={linkInteractionClass}>
                                                <p className="text-sm text-white/70">@{user.username}</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(!isTouchDevice || isOverlayVisible) && (
                                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 ${bottomOverlayClasses}  ${post.isVertical ? 'pb-3 pr-2 pl-2' : 'pl-2 pr-2'} text-white`}>
                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                                        <p className="text-sm text-white/80 line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className={`border-t ${post.isVertical ? 'pb-2' : 'pb-0'}}`}>
                                        <LikeButton
                                            postId={post.id}
                                            userId={userId}
                                            initialLiked={liked}
                                            initialLikes={post.likes || 0} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                    {userId === user.id || role === 'admin' ?
                        <DeletePostButton postId={post.id} />
                        : null}
                </div>
                <Card className="flex-1 w-full md:max-w-[40%] max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
                    <CardTitle className="text-lg font-semibold p-2">Comments</CardTitle>
                    <div className="overflow-y-auto ">
                        <Comments postId={post.id} userId={userId} />
                    </div>
                </Card>
            </div >
        </div >
    )
}