'use server'

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export default async function Page() {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2  items-center justify-center px-2 my-2 sm:flex-row">
            <PostCard />
        </div>
    )
}



async function PostCard() {
    return (
        <Card className='m-2'>
            <CardContent>
                <Image
                    src='/trees_vertical.jpg'
                    width="642"
                    height="903"
                    alt="landscape"
                    className="">
                </Image>
            </CardContent>
            <CardDescription className='mx-4'>
                <h1 className='text-2xl font-bold'>Title</h1>
                <p className='text-sm'>Description</p>
            </CardDescription>
        </Card>
    )
}