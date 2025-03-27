import { Suspense } from "react"
import Loading from "./loading"
import { verifySession } from "@/app/(public)/auth/session"
import { getUser } from "@/app/actions/feed/actions"
import { UserCard } from "@/components/profile/user-card"
import { Bio } from "@/components/profile/bio"
import { ProfileEditor } from "@/components/profile/ProfileEditor"
import { Button } from "@/components/ui/button"

export default async function UserPage({ params }: { params: { username: string } }) {
    const { username } = await params
    const session = await verifySession()

    if (!session.userId || !session.isAuth) {
        return <div> Not logged in </div>
    }

    const user = await getUser(session.userId)

    console.log(user)

    if (!user) {
        return <div> User not found </div>
    }

    return (
        <div className="container max-w-4xl mx-auto py-6 space-y-6">
            <Suspense fallback={<Loading />}>
                <div className="flex justify-between items-center">
                    <UserCard profile_picture={user.profile_picture} username={user.username} />
                    <Button variant="outline">Edit Profile</Button>
                </div>

                {/* <Bio bio={user.bio ?? ""} /> */}

                {/* Profile Editor - This would typically be conditionally shown */}
                <ProfileEditor
                    username={user.username}
                    bio={user.bio ?? ""}
                />
            </Suspense>
        </div>
    )
}

