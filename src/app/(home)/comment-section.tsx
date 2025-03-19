'use client'

import { Comments } from "./comments"

interface CommentSectionProps {
    postId: number
    userId: number
    show: boolean
}

export function CommentSection({ postId, userId, show }: CommentSectionProps) {
    if (!show) return null

    return (
        <div className="w-full bg-background z-10 border-t shadow-lg rounded-b-lg">
            <Comments postId={postId} userId={userId} />
        </div>
    )
}
