import { StaticImport } from "next/dist/shared/lib/get-img-props"

export type PostData = {
    post: {
        id: number
        file_path: string | StaticImport
        title: string | null
        description: string | null
        likes: number | null
        isVertical: boolean | null
        category: string
    }
    user: {
        id: number
        username: string
        profile_picture: string
    }
    liked: boolean
    userId: number
    role?: string
}