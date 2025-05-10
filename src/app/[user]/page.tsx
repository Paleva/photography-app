import { UserCard } from "@/components/profile/UserCard"
import { db, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getFeedPosts } from "../actions/feed/actions"
import { InfiniteFeedUser } from "@/components/feed/infinite-feed-user"
import { verifySession } from "../(public)/auth/session"
import { DeleteUser } from "@/components/admin/DeleteUser"

export default async function Page({
    params,
}: {
    params: Promise<{ user: string }>
}) {
    const { user } = await params

    const [result] = await db
        .select({
            id: users.id,
            username: users.username,
            profile_picture: users.profile_picture,
            bio: users.bio,
        })
        .from(users)
        .where(eq(users.username, user))


    if (!result) {
        return <div className="flex justify-center items-center">User not found</div>
    }

    const userId = result.id
    const initialPosts = await getFeedPosts(20, 0, { filterByUploaderId: userId })

    const session = await verifySession()
    const isAdmin = session.role === 'admin'

    return (
        <div>
            <div className="relative w-full my-4">
                <div className="flex justify-center items-center">
                    <UserCard username={result.username} profile_picture={result.profile_picture} bio={result.bio || ''} />
                </div>
                {isAdmin && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <DeleteUser userId={userId} />
                    </div>
                )}
            </div>
            <div className='p-2'>
                <InfiniteFeedUser
                    initialPosts={initialPosts.posts}
                    getPosts={getFeedPosts}
                    userId={userId}
                />
            </div>
        </div>
    )

}