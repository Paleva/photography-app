'use server'
import { users, db, comments, likes, posts } from '@/db/schema'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { uploadUserSchema, UploadUserFormState } from '@/app/api/upload/validaror'
import { ChangePasswordFormSchema, FormState } from './validation'
import path from 'path'
import { getUser } from '../feed/actions'
import { verifySession, deleteCookie } from '@/app/(public)/auth/session'
import bcrypt from "bcrypt"




export async function changePassword(state: FormState, formData: FormData): Promise<FormState> {
    const { userId } = await verifySession()
    if (!userId) {
        return {
            message: "User not logged in",
            success: false
        }
    }

    try {

        const validatedFields = ChangePasswordFormSchema.safeParse({
            password: formData.get('password'),
            repeatedPassword: formData.get('repeatedPassword'),
        })

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        const { password, repeatedPassword } = validatedFields.data
        console.log(validatedFields.data)
        const hashedPassword = await bcrypt.hash(password, 10)

        const [updatedUser] = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId)).returning()

        return {
            message: "Password successfully changed. Please login again",
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Error while changing password. Something went wrong",
            success: false
        }
    }
}

export async function deleteAccount() {
    const { userId } = await verifySession()

    if (!userId) {
        return null
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.id, userId))

        const [resultPosts] = await db.delete(posts).where(eq(posts.user_id, user.id)).returning()

        const [resultComments] = await db.delete(comments).where(eq(comments.user_id, user.id)).returning()

        const [resultLikes] = await db.delete(likes).where(eq(likes.user_id, user.id)).returning()

        const [result] = await db.delete(users).where(eq(users.id, user.id)).returning()

        return {
            message: "Successfully deleted account and everything associated with it",
            success: true
        }

    } catch (error) {
        console.log(error)
        return {
            error: "Error while deleting account. Something went wrong",
            success: false
        }
    }
}

// Add a new function to handle logout after account deletion
export async function logoutAfterDeletion() {
    await deleteCookie()
    return { success: true }
}

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
            console.log("FILE:" + result + "\n SIZE:" + file.size / 1024 / 1024 + "MB")
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
