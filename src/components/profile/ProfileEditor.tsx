"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
export function ProfileEditor({
    username,
    bio
}: {
    username: string,
    bio: string
}) {

    const [edit, setEdit] = useState(false)
    const [deleteWindow, setDeleteWindow] = useState(false)
    const [passwordWindow, setPasswordWindow] = useState(false)

    const handleClick = () => {
        console.log("Clicked")
    }

    return (
        <div className="space-y-4 mt-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold ">Edit Profile</h2>
                <Button onClick={() => setEdit(true)} variant="outline">Edit Profile</Button>
            </div>
            <form>
                <div className="space-y-3 pb-4">
                    <Label htmlFor="username" className="block text-sm font-medium">
                        Username
                    </Label>
                    <Input
                        disabled={!edit}
                        id="username"
                        defaultValue={username}
                        placeholder="Enter username"
                    />
                </div>

                <div className="space-y-3 pb-4">
                    <Label htmlFor="bio" className="block text-sm font-medium">
                        Bio
                    </Label>
                    <Textarea
                        disabled={!edit}
                        id="bio"
                        defaultValue={bio}
                        placeholder="Write something about yourself..."
                        rows={4}
                    />
                </div>

                <div className="space-y-3 pb-4">
                    <Label htmlFor="profile-picture" className="block text-sm font-medium">
                        Profile Picture
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            disabled={!edit}
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                        />
                    </div>
                </div>
            </form>
            <div className="flex gap-2 justify-start">
            </div>
            <div className="flex gap-2 justify-end">
                <Button onClick={() => setDeleteWindow(true)} variant="destructive">Delete account</Button>
                <Dialog open={deleteWindow}>
                    <DialogContent>
                        <div className="flex justify-between items-center mb-2">
                            <DialogTitle className="text-lg font-medium">Are you sure you want to delete your account?</DialogTitle>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteWindow(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                            {/* <h1>AAAAAAAA</h1> */}
                        </div>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => setDeleteWindow(false)} variant="outline">Cancel</Button>
                            <Button onClick={() => setDeleteWindow(false)} variant="destructive">Delete Account</Button>
                        </div>
                    </DialogContent>
                </Dialog>
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
                            <Button className="my-2 w-full" variant='default'> Change password </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button onClick={() => setEdit(false)} variant="outline">Cancel</Button>
                <Button onClick={handleClick}> Save Changes</Button>
            </div>
        </div>
    )
}
