import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
export function ProfileEditor({
    username,
    bio
}: {
    username: string,
    bio: string
}) {
    return (
        <div className="space-y-4 mt-6 p-4 border rounded-lg">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <form>
                <div className="space-y-3 pb-4">
                    <Label htmlFor="username" className="block text-sm font-medium">
                        Username
                    </Label>
                    <Input
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
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                        />
                    </div>
                </div>
            </form>
            <div className="flex gap-2 justify-start">
                <Button variant="outline">Change Password</Button>
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}
