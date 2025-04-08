'use client'

import { deleteFunction } from "@/app/actions/post/actions"
import { Button } from "@/components/ui/button"
import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { X } from "lucide-react"
import { Input } from "../ui/input";




export function DeletePostButton({ postId }: { postId: number }) {

    const [show, setShow] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [state, action, pending] = useActionState(deleteFunction, {
        error: "",
        message: "",
        success: false
    })

    useEffect(() => {
        if (state?.success) {
            setDeleted(true)
        }
    }, [state])

    return (
        <div>
            <Button onClick={() => setShow(true)} className="w-full mt-2" variant="destructive"> Delete post </Button>
            <Dialog open={show} onOpenChange={(open) => setShow(open)}>
                <DialogContent>
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-lg font-medium">
                            {!deleted
                                ? "Delete Post"
                                : "Post Deleted"}
                        </DialogTitle>
                        <Button variant='ghost' size='sm' onClick={() => setShow(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {!deleted && (
                        <div className="text-md my-2">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </div>
                    )}
                    {state?.message && state?.success && (
                        <div className="p-3 mt-2 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {state.message}
                        </div>
                    )}
                    {state?.error && (
                        <div className="p-3 mt-2 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center">
                            <p className='text-red-500 text-md'>{state.error}</p>
                        </div>
                    )}
                    {!deleted ? (
                        <div className="flex justify-between items-center">
                            <Button onClick={() => setShow(false)}>Cancel</Button>
                            <form action={action}>
                                <Input type='hidden' id='postId' name='postId' value={postId} />
                                <Button type='submit' variant="destructive" aria-disabled={pending} disabled={pending}>Delete</Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <Button onClick={() => setShow(false)}>Close</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    )
}