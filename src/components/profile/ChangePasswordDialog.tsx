"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function ChangePasswordDialog() {
    const [passwordWindow, setPasswordWindow] = useState(false)

    return (
        <>
            <Button onClick={() => setPasswordWindow(true)} variant="outline">Change Password</Button>
            <Dialog open={passwordWindow}>
                <DialogContent>
                    <div className="flex justify-between items-center mb-2">
                        <DialogTitle className="text-lg font-medium">Change Password</DialogTitle>
                        <Button variant="ghost" size="sm" onClick={() => setPasswordWindow(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-col junstify-between items-center">
                        <Label htmlFor="new-password" className="block text-sm font-medium my-2">
                            New password
                        </Label>
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter current password"
                            className="my-2"
                        />
                        <Label htmlFor="repeat-new-password" className="block text-sm font-medium my-2">
                            Repeat new password
                        </Label>
                        <Input
                            id="repeat-new-password"
                            type="password"
                            placeholder="Enter current password"
                            className="my-2"
                        />
                        <Button className="my-2 w-full" variant='default'>Change password</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
