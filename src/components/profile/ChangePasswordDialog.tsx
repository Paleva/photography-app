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
                        <DialogTitle className="text-lg font-medium">Change Password</DialogTitle>
                        <Button variant="ghost" size="sm" onClick={() => setPasswordWindow(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
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
                    {state?.message && (
                        <>
                            <p className={`text-md ${state.success ? "text-green-500" : "text-red-500"}`}>
                                {state.message}
                            </p>
                        </>
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
