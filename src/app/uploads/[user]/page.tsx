import { getSession } from '@/app/(public)/auth/session'
import { getPostsByUser } from '@/app/actions/actions'
export default async function UploadsPage({ params }: { params: { username: string } }) {

    const { username } = await params
    const session = await getSession()
    if (!session) {
        return <div>Please login</div>
    }

    const postIds = await getPostsByUser(username)
    return (
        <div>
            <h1>Page for {username} uploads</h1>
        </div>
    )

}