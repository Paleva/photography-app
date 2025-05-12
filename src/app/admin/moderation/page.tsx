import { Card } from "@/components/ui/card";
import { db, users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DeleteUser } from "@/components/admin/DeleteUser";
import Link from "next/link";

export default async function ModerationPage() {

    const allUsers = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            profilePicture: users.profile_picture,
            createdAt: users.created_at,
        })
        .from(users)
        .orderBy(desc(users.created_at))

    return (
        <div className="items-center justify-center h-screen gap-2">
            <h1 className='text-2xl font-bold'>Moderation</h1>
            <div className="">

                {allUsers.map((user) => (
                    <div key={user.id} className="m-4 flex flex-row items-center justify-start bg-muted p-4 rounded-lg">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.profilePicture} alt={user.username} />
                            <AvatarFallback className="bg-primary/20 text-primary text-2xl">{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row items-center justify-center ml-4 space-x-12">
                            <div>
                                <Link href={`/${user.username}`} className="text-lg font-bold">
                                    <p>{user.username}</p>
                                </Link>
                            </div>
                            <div className="w-1/4">
                                <p>{user.email}</p>
                            </div>
                            <div className="w-1/4">
                                <p>{user.role}</p>
                            </div>
                            <div className="w-1/4">
                                <p>{user.createdAt.toString()}</p>
                            </div>
                            <div className="1/4">
                                <DeleteUser userId={user.id} />
                            </div>
                        </div>
                    </div>
                ))
                }
            </div >
        </div >
    )
}