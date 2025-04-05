import { Suspense } from "react"
import Loading from "./loading"
import { verifySession } from "@/app/(public)/auth/session"
import { getUser } from "@/app/actions/feed/actions"
import { ProfileEditor } from "@/components/profile/ProfileEditor"

export default async function UserPage() {

    const session = await verifySession()

    if (!session.userId || !session.isAuth) {
        return <div> Not logged in </div>
    }

    const user = await getUser(session.userId)

    if (!user) {
        return <div> User not found </div>
    }

    return (
        <div className="container max-w-4xl mx-auto py-6 space-y-6">
            <Suspense fallback={<Loading />}>
                {/* Profile Editor - This would typically be conditionally shown */}
                <ProfileEditor
                    username={user.username}
                    bio={user.bio ?? ""}
                    userId={session.userId}
                    profilePicture={user.profile_picture ?? ""}
                />
            </Suspense>
        </div>
    )
}

