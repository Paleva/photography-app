import { UserCard } from "@/components/profile/UserCard"
import { db, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCategories, getPaginatedPostsUser } from "../actions/feed/actions"
import { InfiniteFeed } from "@/components/feed/infinite-feed"

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
    const categories = await getCategories()
    const categoriesNames = categories.map((category: { name: string }) => category.name)
    const initialPosts = await getPaginatedPostsUser(20, 0, '', userId)

    return (
        <div>
            <div className="flex justify-center items-center my-4">
                <UserCard username={result.username} profile_picture={result.profile_picture} bio={result.bio || ''} />
            </div>
            <InfiniteFeed
                initialPosts={initialPosts.posts}
                getPosts={getPaginatedPostsUser}
            />
        </div>
    )

}