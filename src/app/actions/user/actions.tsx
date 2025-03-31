'use server'
import { users, db } from '@/db/schema'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import path from 'path'


export async function postBio(bio: string, userId: number) {

}

export async function postProfilePicture(file: File, userId: number, username: string) {
    try {
        const filename = file.name.replace(file.name, randomUUID())
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(
            path.join(process.cwd(), '/public/uploads/' + filename + '.' + file.name.split('.').pop()),
            buffer
        )
        const pathname = '/uploads/' + filename + '.' + file.name.split('.').pop()
        const result = await db.update(users).set({ profile_picture: pathname }).where(eq(users.id, userId)).returning()

        revalidatePath(`/user/${username}` + userId)
        return result[0].profile_picture
    } catch (error) {
        console.log(error)
        return null
    }
}
export async function postUsername(username: string, userId: number) {

}