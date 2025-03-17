import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Suspense } from "react"
import Loading from "./loading"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "@/styles/masonry.module.css"
import { photos, db, categories, userTable } from '@/db/schema'
import { eq, is } from 'drizzle-orm'
import { imageSizeFromFile } from 'image-size/fromFile'
import path from 'path'


export default async function Page() {
    return (
        <div className={`p-4 ${styles.masonry}`}>
            {[...Array(13)].map((_, index) => (
                <div key={index + 1} className={styles.masonryItem}>
                    <PostCard id={index + 29} />
                </div>
            ))}
        </div>
    )
}

async function getPost(id: number) {
    const posts = await db.select().from(photos).where(eq(photos.id, id))
    const users = await db.select().from(userTable).where(eq(userTable.id, posts[0].user_id))

    const post = posts[0]
    const user = users[0]
    const file_path = path.join(process.cwd(), "/public", post.file_path)
    const dimension = await imageSizeFromFile(file_path)
    const isVertical = dimension.height > dimension.width
    return { post, user, isVertical }
}

async function PostCard({ id }: { id: number }) {
    const { post, user, isVertical } = await getPost(id);
    console.log(post)

    return (
        <Suspense fallback={<Loading />}>
            <Card className="overflow-hidden flex flex-col h-full">

                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 relative">
                    {isVertical ? (
                        // Vertical image container - taller with natural height
                        <div className="w-full h-auto relative">
                            <Image
                                src={post.file_path}
                                width={500}
                                height={800}
                                className="w-full h-auto object-cover"
                                alt="post image"
                                priority
                            />
                        </div>
                    ) : (
                        // Horizontal image container
                        <div className="w-full relative">
                            <Image
                                src={post.file_path}
                                width={800}
                                height={450}
                                className="w-full h-auto object-cover"
                                alt="post image"
                                priority
                            />
                        </div>
                    )}
                </CardContent>

                <div className="p-4 flex-grow">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                        {post.description}
                    </CardDescription>
                </div>

                <CardFooter className="border-t p-4">
                    <div className="flex justify-between w-full">
                        <Button variant="ghost" size="sm" className="flex gap-2">
                            <Heart size={20} /> <span>Like</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex gap-2">
                            <MessageCircle size={20} /> <span>Comment</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Suspense>
    )
}