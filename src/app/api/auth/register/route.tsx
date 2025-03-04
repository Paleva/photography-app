'use server'

import 'dotenv/config'
import bcrypt from "bcrypt"
import { userTable } from '@/db/schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from "drizzle-orm"
import { NextResponse } from 'next/server'

const db = drizzle(process.env.DATABASE_URL)

export async function POST(req: Request) {
    const { email, password, username } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    // console.log(email, hashedPassword)

    const userExists = await db.select().from(userTable).where(eq(userTable.email, email))
    if (userExists.length > 0) {
        return NextResponse.json({ message: "User already exists" }, { status: 401 })
    }

    const newUser = {
        username: username,
        email: email,
        password: hashedPassword,
        role: "user"
    }

    const user = await db.insert(userTable).values(newUser).returning()

    if (!user) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    } else {
        const redirectUrl = new URL('/home', req.url)
        return NextResponse.redirect(redirectUrl.toString())
    }
}
