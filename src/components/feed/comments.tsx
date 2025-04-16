'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addComment, getComments } from "../../app/actions/feed/comments-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Comments({ postId, userId }: { postId: number, userId: number }) {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadComments = async () => {
        setIsLoading(true);
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments || []);
        setIsLoading(false);
    };

    // Load comments when component mounts
    useEffect(() => {
        loadComments();
    }, [postId]);

    const handleSubmitComment = async () => {
        if (!comment.trim() || userId === -1) return;

        try {
            const newComment = await addComment(postId, userId, comment);
            if (newComment) {
                setComments((prev) => [...prev, newComment]);
                setComment("");
                setTimeout(() => {
                    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
                    if (scrollContainer) {
                        scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    }
                }, 100);
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };
    return (
        <div className="border-t pt-4  pb-2">

            <ScrollArea className="h-[200px] ">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground m-4">No comments yet. Be the first!</p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 m-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                                    <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{comment.user.username}</p>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm">{comment.comment_text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="flex gap-2 p-2 m-2">
                <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={userId === -1}
                />
                <Button
                    onClick={handleSubmitComment}
                    disabled={!comment.trim() || userId === -1}
                // size="sm"
                >
                    Post
                </Button>
            </div>
            {userId === -1 && (
                <p className="text-xs text-muted-foreground mt-2">
                    Please log in to comment
                </p>
            )}
        </div>
    );
}
