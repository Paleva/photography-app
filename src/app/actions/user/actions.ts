'use server'
import { users, db, comments, likes, posts } from '@/db/schema'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { uploadUserSchema, UploadUserFormState } from '@/app/api/upload/validation'
import { ChangePasswordFormSchema, FormState, DeleteFormState, DeleteAccountSchema } from './validation'
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

        if (password !== repeatedPassword) {
            return {
                message: "Passwords do not match",
                success: false
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))

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

export async function deleteAccount(state: DeleteFormState, formData: FormData): Promise<DeleteFormState> {

    const validatedFields = DeleteAccountSchema.safeParse({
        userId: formData.get('userId'),
    })
    console.log('validatedFields', JSON.stringify(validatedFields))
    if (!validatedFields.success) {
        return {
            error: "Invalid user ID",
            success: false
        }
    }
    const { userId: idToDelete } = validatedFields.data

    const { userId, role } = await verifySession()

    console.log('userId', userId)
    console.log('idToDelete', idToDelete)

    if (!userId) {
        return {
            error: "User not logged in",
            success: false
        }
    }

    try {
        if (idToDelete === userId) {
            const [user] = await db.select().from(users).where(eq(users.id, userId))
            await db.delete(posts).where(eq(posts.user_id, user.id))
            await db.delete(comments).where(eq(comments.user_id, user.id))
            await db.delete(likes).where(eq(likes.user_id, user.id))
            await db.delete(users).where(eq(users.id, user.id))
        } else if (role.toLowerCase() === 'admin') {
            const [user] = await db.select().from(users).where(eq(users.id, idToDelete))
            await db.delete(posts).where(eq(posts.user_id, user.id))
            await db.delete(comments).where(eq(comments.user_id, user.id))
            await db.delete(likes).where(eq(likes.user_id, user.id))
            await db.delete(users).where(eq(users.id, user.id))
        }
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
                errors: validatedFields.error.flatten().fieldErrors,
                success: false
            }
        }

        const { file, username, bio, id } = validatedFields.data
        const userId = parseInt(id)
        const user = await getUser(userId)

        if (file.size > 0) {
            const filename = file.name.replace(file.name, randomUUID()) + '.' + file.name.split('.').pop()
            const buffer = Buffer.from(await file.arrayBuffer())
            await writeFile(
                path.join(process.cwd(), '/uploads/' + filename),
                buffer
            )
            const filePath = '/api/file/' + filename
            await db.update(users).set({ profile_picture: filePath }).where(eq(users.id, userId))
        }

        if (bio) {
            await db.update(users).set({ bio: bio }).where(eq(users.id, userId))
        }

        if (username !== user?.username) {
            const usernameExists = await db.select().from(users).where(eq(users.username, username))
            if (usernameExists.length > 0) {
                return {
                    errors: {
                        username: ["Username already exists"]
                    },
                    success: false
                }
            }
            await db.update(users).set({ username: username }).where(eq(users.id, userId))
        }
        return {
            message: 'Profile successfully updated',
            success: true,
            errors: {},
        }
    } catch (error) {
        console.log(error)
        return {
            message: 'Error updating profile',
            success: false,
            errors: {}
        }
    }
}
