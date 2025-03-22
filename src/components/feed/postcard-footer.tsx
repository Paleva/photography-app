'use client'

import { useState } from 'react'
import { CardFooter } from "@/components/ui/card"
import { LikeButton } from "./like-button"
import { CommentButton } from "./comment-button"
import { CommentSection } from "./comment-section"

interface PostCardFooterProps {
    postId: number
    userId: number
    initialLiked: boolean
    initialLikes: number
}

export function PostCardFooter({ postId, userId, initialLiked, initialLikes }: PostCardFooterProps) {
    const [showComments, setShowComments] = useState(false)

    const toggleComments = () => {
        setShowComments(prev => !prev)
    }

    return (

        <CardFooter className="border-t p-4 grid grid-cols-1 ">
            <div className='flex justify-between'>
                <div >
                    <LikeButton
                        postId={postId}
                        userId={userId}
                        initialLiked={initialLiked}
                        initialLikes={initialLikes}
                    />
                </div>
                <div >
                    <CommentButton
                        postId={postId}
                        userId={userId}
                        showComments={showComments}
                        toggleComments={toggleComments}
                    />
                </div>
            </div>
            <div className='col-span-2'>
                <CommentSection
                    postId={postId}
                    userId={userId}
                    show={showComments}
                />
            </div>

        </CardFooter>

    )
}
