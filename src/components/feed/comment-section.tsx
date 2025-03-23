'use client'

import { Comments } from "./comments"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CommentSectionProps {
    postId: number
    userId: number
    show: boolean
    onClose: () => void
}

export function CommentSection({ postId, userId, show, onClose }: CommentSectionProps) {
    // For small screens, use a dialog (modal)
    return (
        <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Comments</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Comments postId={postId} userId={userId} />
            </DialogContent>
        </Dialog>
    )
}
