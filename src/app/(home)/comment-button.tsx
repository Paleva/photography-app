'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface CommentButtonProps {
    postId: number
    userId: number
    showComments: boolean
    toggleComments: () => void
}

export function CommentButton({ showComments, toggleComments }: CommentButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 grow"
            onClick={toggleComments}
        >
            <MessageCircle size={20} />
            <span>Comment</span>
        </Button>
    )
}