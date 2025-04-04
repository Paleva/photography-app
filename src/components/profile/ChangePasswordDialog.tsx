"use client"
import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { changePassword, logoutAfterDeletion } from "@/app/actions/user/actions"
import { useRouter } from "next/navigation"

export function ChangePasswordDialog() {
    const [passwordWindow, setPasswordWindow] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const router = useRouter()

    const [state, action, pending] = useActionState(changePassword, {
        errors: undefined,
        message: undefined
    })


    useEffect(() => {
        if (state?.success) {
            setPasswordChanged(true)
        }
    }, [state])

    // Function to handle dialog close and redirect
    const handleClose = async () => {
        if (passwordChanged) {
            // Logout and redirect to login page
            await logoutAfterDeletion()
            router.push('/')
        } else {
            setPasswordWindow(false)
        }
    }

    return (
        <>
            <Button onClick={() => setPasswordWindow(true)} variant="outline">Change Password</Button>
            <Dialog open={passwordWindow} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent>
                    <div className="flex justify-between items-center mb-2">
                        <DialogTitle className="text-lg font-medium">
                            {!passwordChanged
                                ? "Change Password"
                                : "Password Changed"}
                        </DialogTitle>
                        <Button variant="ghost" size="sm" onClick={() => setPasswordWindow(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {!passwordChanged && (
                        <div className="flex-col junstify-between items-center">
                            <form action={action}>
                                <Label htmlFor="new-password" className="block text-sm font-medium my-2">
                                    New password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter current password"
                                    className="my-2"
                                />
                                {state?.errors?.password && (
                                    <p className="text-red-500 text-md">
                                        {state.errors.password}
                                    </p>
                                )}
                                <Label htmlFor="repeat-new-password" className="block text-sm font-medium my-2">
                                    Repeat new password
                                </Label>
                                <Input
                                    id="repeatedPassword"
                                    name="repeatedPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                    className="my-2"
                                />
                                {state?.errors?.repeatedPassword && (
                                    <p className="text-red-500 text-md">
                                        {state.errors.repeatedPassword}
                                    </p>
                                )}
                                <Button className="my-2 w-full" disabled={pending} aria-disabled={pending} type='submit' variant='default'>Change password</Button>
                            </form>
                        </div>
                    )}
                    {state?.message && (
                        <div className="p-3 mt-2 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {state.message}
                        </div>
                    )}
                    {passwordChanged && (
                        <div className="flex justify-center mt-4">
                            <Button onClick={handleClose} variant="default">Close and Logout</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
