"use client"
import { deleteAccount, logoutAfterDeletion } from "@/app/actions/user/actions"
import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteAccountDialog() {
    const [deleteWindow, setDeleteWindow] = useState(false)
    const [accountDeleted, setAccountDeleted] = useState(false)
    const router = useRouter()

    const [state, action, pending] = useActionState(deleteAccount, null)

    useEffect(() => {
        if (state?.success) {
            setAccountDeleted(true)
        }
    }, [state])

    // Function to handle dialog close and redirect
    const handleClose = async () => {
        if (accountDeleted) {
            // Logout and redirect to login page
            await logoutAfterDeletion()
            router.push('/')
        } else {
            setDeleteWindow(false)
        }
    }

    return (
        <>
            <Button onClick={() => setDeleteWindow(true)} variant="destructive">Delete account</Button>
            <Dialog open={deleteWindow} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <div className="flex justify-between items-center mb-2">
                        <DialogTitle className="text-lg font-medium">
                            {!accountDeleted
                                ? "Are you sure you want to delete your account?"
                                : "Account Deleted"}
                        </DialogTitle>
                        <Button variant="ghost" size="sm" onClick={handleClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {state?.message && (
                        <div className="p-3 mt-2 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {state.message}
                        </div>
                    )}
                    {!accountDeleted ? (
                        <div className="flex justify-between items-center">
                            <Button onClick={handleClose} variant="outline">Cancel</Button>
                            <form action={action}>
                                <Button type='submit' size='lg' aria-disabled={pending} disabled={pending} variant="destructive">Delete Account</Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex justify-center mt-4">
                            <Button onClick={handleClose} variant="default">Close and Logout</Button>
                        </div>
                    )}

                    {state?.error && (
                        <div className="p-3 mt-2 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center">
                            <p className='text-red-500 text-md'>{state.error}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
