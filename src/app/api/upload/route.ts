import 'server-only'

import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'
import { posts, db, categories } from '@/db/schema'
import { imageSizeFromFile } from 'image-size/fromFile'
import { eq } from 'drizzle-orm'
import { UploadPostFormState, uploadPostSchema } from './validaror'
import { verifySession } from '@/app/(public)/auth/session'

export async function POST(req: Request) {

    const session = await verifySession()

    if (session.isAuth === false) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    const validatedFields = uploadPostSchema.safeParse({
        file: formData.get('file'),
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors)
        return NextResponse.json({
            message: validatedFields.error.flatten().fieldErrors
        }, { status: 400 })
    }

    const { file, title, category, description } = validatedFields.data

    if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }


    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name.replace(file.name, randomUUID()) + '.' + file.name.split('.').pop()

    try {
        const user = session.userId as number

        await writeFile(
            path.join(process.cwd(), '/public/uploads/' + filename),
            buffer
        )

        const category_id: { id: number }[] = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, category))

        const dimension = await imageSizeFromFile(path.join(process.cwd(), "/public/uploads/", filename))
        const isVertical = dimension.height > dimension.width

        await db.insert(posts).values({
            title: title,
            filename: filename,
            file_path: "/uploads/" + filename,
            user_id: user,
            description: description,
            isvertical: isVertical,
            category_id: category_id[0].id
        })

        return NextResponse.json({ success: true, filename })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
