import "server-only"

import 'dotenv/config'
import bcrypt from "bcrypt"
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { userTable } from '@/db/schema'
import { NextResponse } from 'next/server'


const db = drizzle(process.env.DATABASE_URL)

export async function POST(req: Request) {

    const { email, password } = await req.json()


    const users = await db.select().from(userTable).where(eq(userTable.email, email))

    if (users.length === 0) {
        const redirectUrl = new URL('/register', req.url)
        return NextResponse.redirect(redirectUrl.toString())

    }

    const user = users[0]

    if (await bcrypt.compare(password, user.password)) {
        const redirectUrl = new URL('/home', req.url)
        return NextResponse.redirect(redirectUrl.toString())
    } else {
        console.log("PIZDI NAXUI IS CIA")
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })

    }

}
