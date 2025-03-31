'use server'
import { users, db } from '@/db/schema'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import { uploadUserSchema, UploadUserFormState } from '@/app/api/upload/validaror'
import path from 'path'
import { getUser } from '../feed/actions'


export async function postProfileInfo(
    state: UploadUserFormState,
    formData: FormData
): Promise<UploadUserFormState> {
    try {

        const validatedFields = uploadUserSchema.safeParse({
            file: formData.get('avatar'),
            username: formData.get('username'),
            bio: formData.get('bio'),
            id: formData.get('userId')
        })
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        const { file, username, bio, id } = validatedFields.data
        const userId = parseInt(id)
        const user = await getUser(userId)

        if (file.size > 0) {
            console.log("FILENAME:" + file.name)
            const filename = file.name.replace(file.name, randomUUID())
            const buffer = Buffer.from(await file.arrayBuffer())
            await writeFile(
                path.join(process.cwd(), '/public/uploads/' + filename + '.' + file.name.split('.').pop()),
                buffer
            )
            const pathname = '/uploads/' + filename + '.' + file.name.split('.').pop()
            const result = await db.update(users).set({ profile_picture: pathname }).where(eq(users.id, userId)).returning()
            console.log("FILE:" + result)
        }

        if (bio) {
            const result = await db.update(users).set({ bio: bio }).where(eq(users.id, userId)).returning()
            console.log("BIO:" + result)
        }

        if (username !== user?.username) {
            const usernameExists = await db.select().from(users).where(eq(users.username, username))
            if (usernameExists.length > 0) {
                return {
                    errors: {
                        username: ["Username already exists"]
                    }
                }
            }
            const result = await db.update(users).set({ username: username }).where(eq(users.id, userId)).returning()
            console.log("USERNAME:" + result)
        }
        console.log("SUCCESS")
        return {
            message: 'Profile successfully updated',
            errors: {},
        }
    } catch (error) {
        console.log(error)
        return {
            message: 'Error updating profile',
            errors: {}
        }
    }
}
