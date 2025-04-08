'use client'

import { useState } from 'react'
import { CardFooter } from "@/components/ui/card"
import { LikeButton } from "./LikeButton"
import { CommentButton } from "./CommentButton"
import { CommentSection } from "./CommentSection"

interface PostCardFooterProps {
    postId: number
    userId: number
    initialLiked: boolean
    initialLikes: number
    isVertical: boolean | null
}

export function PostCardFooter({ postId, userId, initialLiked, initialLikes, isVertical }: PostCardFooterProps) {
    const [showComments, setShowComments] = useState(false)
    const toggleComments = () => {
        setShowComments(prev => !prev)
    }

    return (

        <CardFooter className={`border-t pt-2 pl-2 pr-2 grid grid-cols-1 text-sm sm:text-base ${isVertical ? 'pb-2' : 'pb-0'}`}>
            <div className='flex justify-between items-center gap-2'>
                <div className='scale-90 sm:scale-100'>
                    <LikeButton
                        postId={postId}
                        userId={userId}
                        initialLiked={initialLiked}
                        initialLikes={initialLikes}
                    />
                </div>
                <div className="scale-90 sm:scale-100">
                    <CommentButton
                        postId={postId}
                        userId={userId}
                        showComments={showComments}
                        toggleComments={toggleComments}
                    />
                </div>
            </div>
            <div className='col-span-2 mt-1 sm:mt-2'>
                <CommentSection
                    postId={postId}
                    userId={userId}
                    show={showComments}
                    onClose={toggleComments}
                />
            </div>

        </CardFooter>

    )
}
