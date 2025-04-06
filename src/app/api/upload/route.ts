import 'server-only'

import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'
import { posts, db, categories } from '@/db/schema'
import { imageSizeFromFile } from 'image-size/fromFile'
import { eq } from 'drizzle-orm'
import { uploadPostSchema } from './validation'
import { verifySession } from '@/app/(public)/auth/session'

function validateImageSignature(buffer: Buffer): string | null {
    // Check for image file signatures (magic bytes)
    if (buffer.length < 12) return null; // Too small to be valid

    // JPEG signature - starts with FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return 'jpeg';
    }

    // PNG signature - starts with 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
        return 'png';
    }

    // GIF signature - starts with GIF87a or GIF89a
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 &&
        buffer[3] === 0x38 && (buffer[4] === 0x37 || buffer[4] === 0x39) && buffer[5] === 0x61) {
        return 'gif';
    }

    // WEBP - has RIFF header followed by WEBP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return 'webp';
    }

    return null; // Unknown format
}

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

    const fileExtension = path.extname(file.name).toLowerCase()
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

    if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json({ message: 'Invalid file extension' }, { status: 400 })
    }
    const filename = `${randomUUID()}${fileExtension}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const actualFileType = validateImageSignature(buffer)

    if (!actualFileType) {
        return NextResponse.json({ message: 'Invalid image file' }, { status: 400 })
    }
    try {
        const user = session.userId as number

        const uploadDir = path.join(process.cwd(), 'uploads')
        const filePath = path.join(uploadDir, filename)
        const normalizedPath = path.normalize(filePath)
        if (!normalizedPath.startsWith(uploadDir)) {
            return new NextResponse('Access denied', { status: 403 })
        }

        await writeFile(filePath, buffer)

        const category_id: { id: number }[] = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, category))

        const dimension = await imageSizeFromFile(path.join(process.cwd(), "/uploads/", filename))
        const isVertical = dimension.height > dimension.width

        await db.insert(posts).values({
            title: title,
            filename: filename,
            file_path: "/api/file/" + filename,
            real_path: '/uploads/' + filename,
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
