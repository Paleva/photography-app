import { NextRequest, NextResponse } from 'next/server'
import { validateFileParams } from './validation';
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest, props: { params: Promise<{ file: string[] }> }) {
    const params = await props.params;
    try {

        // Validate the file parameters
        const validatedParams = validateFileParams(params);

        if (!validatedParams.success) {
            // Return validation error
            return new NextResponse(
                JSON.stringify({
                    error: 'Invalid file request',
                    details: validatedParams.error.flatten()
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        const filename = params.file[0]

        const sanitizedFilename = path.basename(filename)

        const uploadDir = path.join(process.cwd(), 'uploads')
        const filePath = path.join(uploadDir, filename)

        const normalizedPath = path.normalize(filePath);
        if (!normalizedPath.startsWith(uploadDir)) {
            return new NextResponse('Access denied', { status: 403 });
        }

        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 })
        }

        const fileBuffer = fs.readFileSync(filePath)
        const fileExtension = path.extname(filePath).toLowerCase()

        // Set appropriate content type
        let contentType = 'application/octet-stream'
        if (fileExtension === '.png') contentType = 'image/png'
        if (fileExtension === '.jpg' || fileExtension === '.jpeg') contentType = 'image/jpeg'
        if (fileExtension === '.gif') contentType = 'image/gif'
        if (fileExtension === '.webp') contentType = 'image/webp'

        // Return the file with proper content type
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000', // Cache for a year
            },
        })
    } catch (error) {
        console.error('Error serving file:', error)
        return new NextResponse('Error serving file', { status: 500 })
    }
}