import { Button } from "@/components/ui/button"
import { EditProfileForm } from "@/components/profile/EditProfileForm"
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog"
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog"

export function ProfileEditor({
    username,
    bio,
    userId
}: {
    username: string,
    bio: string,
    userId: number
}) {
    return (
        <div className="space-y-4 mt-6 p-4 border rounded-lg">
            <EditProfileForm username={username} bio={bio} userId={userId} />
            <div className="flex gap-2 justify-start">
            </div>
            <div className="flex gap-2 justify-end">
                <DeleteAccountDialog />
                <ChangePasswordDialog />
            </div>
        </div>
    )
}
