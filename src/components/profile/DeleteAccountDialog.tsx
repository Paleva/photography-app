"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function DeleteAccountDialog() {
    const [deleteWindow, setDeleteWindow] = useState(false)

    return (
        <>
            <Button onClick={() => setDeleteWindow(true)} variant="destructive">Delete account</Button>
            <Dialog open={deleteWindow}>
                <DialogContent>
                    <div className="flex justify-between items-center mb-2">
                        <DialogTitle className="text-lg font-medium">Are you sure you want to delete your account?</DialogTitle>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteWindow(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <Button onClick={() => setDeleteWindow(false)} variant="outline">Cancel</Button>
                        <Button onClick={() => setDeleteWindow(false)} variant="destructive">Delete Account</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
