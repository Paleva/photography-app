'use client'
import { useState } from "react"

import { EditProfileForm } from "@/components/profile/EditProfileForm"
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog"
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog"
import { UserCard } from "@/components/profile/UserCard"
import { getUser } from "@/app/actions/feed/actions"

export function ProfileEditor({
    username: initialUsername,
    bio: initialBio,
    userId,
    profilePicture: initialProfilePicture
}: {
    username: string,
    bio: string,
    userId: number,
    profilePicture: string
}) {

    const [username, setUsername] = useState(initialUsername)
    const [bio, setBio] = useState(initialBio)
    const [profilePicture, setProfilePicture] = useState(initialProfilePicture)

    const refreshUserData = async () => {
        const refreshedUser = await getUser(userId);
        if (refreshedUser) {
            setUsername(refreshedUser.username);
            setBio(refreshedUser.bio || "");
            setProfilePicture(refreshedUser.profile_picture);
        }
    };

    return (
        <div className="space-y-4 mt-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
                <UserCard profile_picture={profilePicture} username={username} />
            </div>
            <EditProfileForm username={username} bio={bio} userId={userId} onUpdate={refreshUserData} />
            <div className="flex gap-2 justify-start">
            </div>
            <div className="flex gap-2 justify-end">
                <DeleteAccountDialog />
                <ChangePasswordDialog />
            </div>
        </div>
    )
}
