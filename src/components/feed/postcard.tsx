'use client'

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCardFooter } from "@/components/feed/PostcardFooter"
import Link from "next/link"
import { PostData } from "@/types/postdata"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function ClientPostCard({
    post,
    user,
    liked,
    userId
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
            <Card className="overflow-hidden relative">
                <div className="w-1/2 flex items-center justify-center bg-muted">
                    <p className="text-red-500 text-lg">Failed to fetch post</p>
                </div>
            </Card>
        )
    }

    const overlayVisibilityClass = isTouchDevice
        ? isOverlayVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        : "opacity-100 sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto"


    return (
        <Card className="overflow-hidden relative group rounded-lg">
            {/* Image container */}
            <div
                className={`relative ${isTouchDevice ? 'cursor-pointer' : ''}`}
                onClick={handleCardClick}
            >
                <Image
                    src={post.file_path}
                    width={500}
                    height={post.isVertical ? 700 : 500}
                    className="w-full h-full object-cover rounded-lg"
                    alt={post.title || "Post image"}
                    priority={true}
                />

                {/* Top gradient overlay */}
                <div className={`absolute inset-x-0 top-0 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-black/80 to-transparent ${overlayVisibilityClass} transition-opacity duration-300 p-2 sm:p-4 flex items-center text-white`}>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                            {user.profile_picture ? (
                                <AvatarImage src={user.profile_picture} alt={user.username} />
                            ) : null}
                            <AvatarFallback className="bg-primary/20 text-primary text-xs sm:text-sm">{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm sm:text-base">{user.username}</p>
                            <Link href={`/${user.username}`}>
                                <p className="text-xs sm:text-sm text-white/70">@{user.username}</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient overlay */}
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent ${overlayVisibilityClass} transition-opacity duration-300 ${post.isVertical ? 'pb-3 pr-2 pl-2' : 'pl-2 pr-2'}  text-white`}>
                    <div className="mb-1 sm:mb-3 flex items-center justify-between" onClick={e => isTouchDevice && e.stopPropagation()}>
                        <div className="flex-col items-center gap-1 sm:gap-2 max-w-[80%] ml-2">
                            <Link href={`/post/${post.id}`} >
                                <h3 className="font-bold text-xl mb-1 line-clamp-1">{post.title}</h3>
                            </Link>
                            <p className="text-xs sm:text-sm text-white/80 line-clamp-1 sm:line-clamp-2">
                                {post.description}
                            </p>
                        </div>
                        <h4 className="items-center justify-end font-bold text-xs sm:text-base mr-2">{capitalizeFirstLetter(post.category)}</h4>
                    </div>

                    <div onClick={e => isTouchDevice && e.stopPropagation()}>
                        <PostCardFooter
                            postId={post.id}
                            userId={userId}
                            initialLiked={liked}
                            initialLikes={post.likes || 0}
                            isVertical={post.isVertical}
                        />
                    </div>
                </div>

            </div>
        </Card>
    )
}