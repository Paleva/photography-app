export type CommentData = {
    id: number
    comment_text: string
    created_at: Date
    user: {
        id: number
        username: string
        avatar: string
    }
}