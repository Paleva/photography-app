import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'
import { photos, db, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/(public)/auth/session'

export async function POST(req: Request) {
    const formData = await req.formData()
    const file: File | null = formData.get('file') as unknown as File
    const category: string = formData.get('category') as string
    const description: string = formData.get('description') as string

    console.log({ category, description })

    if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    const originalName = file.name
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = originalName + '_' + file.name.replace(file.name, randomUUID())

    try {
        await writeFile(
            path.join(process.cwd(), '/public/uploads/' + filename + '.' + file.name.split('.').pop()),
            buffer
        )

        const cookie = (await cookies()).get('session')?.value;
        const session = await decrypt(cookie);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const user = session.userId as number

        const category_id: { id: number }[] = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, category))

        await db.insert(photos).values({
            title: filename,
            file_path: "/uploads/" + filename + '.' + file.name.split('.').pop(),
            user_id: user,
            description: description,
            category_id: category_id[0].id
        })

        return NextResponse.json({ success: true, filename })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
