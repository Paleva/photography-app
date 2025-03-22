"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"
import { toggleLike } from "../../app/actions/actions"

interface LikeButtonProps {
    postId: number
    userId: number
    initialLiked: boolean
    initialLikes: number
}

export function LikeButton({ postId, userId, initialLiked, initialLikes }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [likeCount, setLikeCount] = useState(initialLikes)
    const [isLoading, setIsLoading] = useState(false)

    const handleLike = async () => {
        if (userId === -1) return

        setIsLoading(true)
        try {
            const liked = await toggleLike(postId, userId)

            if (liked !== null) {
                setIsLiked(liked)
                setLikeCount(prev => liked ? prev + 1 : prev - 1)
            }
        } catch (error) {
            console.error("Failed to toggle like:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="lg"
            className="flex gap-2"
            onClick={handleLike}
            disabled={isLoading || !userId}
        >
            <Heart
                size={64}
                fill={isLiked ? "currentColor" : "none"}
                className={isLiked ? "text-red-500" : ""}
            />
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
        </Button>
    )
}
