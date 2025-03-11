'use server'

import 'dotenv/config'
import { SignupFormSchema, FormState, LoginFormSchema } from "./definitions"
import { userTable, db } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcrypt"
import { createSession } from "./session"
import { authClient } from '@/lib/auth-client'

export async function register(
    state: FormState,
    formData: FormData
): Promise<FormState> {

    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { username, email, password } = validatedFields.data

    const userExists = await db.select().from(userTable).where(eq(userTable.email, email))

    if (userExists.length > 0) {
        return {
            message: "User already exists, please use a different email or login.",
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const data = await db.insert(userTable).values({
        username: username,
        email: email,
        password: hashedPassword,
        role: "user"
    }).returning()

    const user = data[0]

    if (!user) {
        return {
            message: "Server error, please try again.",
        }
    }

    const userId = user.id
    await createSession(userId)

    return {
        message: "Registration successful",
    }
}


export async function login(
    state: FormState,
    formData: FormData
): Promise<FormState> {

    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { email, password } = validatedFields.data

    const userExists = await db.select().from(userTable).where(eq(userTable.email, email))
    console.log(userExists)

    if (userExists.length < 1) {
        return {
            message: "User doesn't exists with this email, please register.",
        }
    }
    const user = userExists[0]

    if (!user) {
        return {
            message: "Server error, please try again.",
        }
    }

    if (!await bcrypt.compare(password, user.password)) {
        return {
            message: "Login failed, wrong password.",
        }
    }

    const userId = user.id
    await createSession(userId)

    return {
        message: "Login successful.",
    }

}