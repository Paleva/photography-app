'use server'

import { db, comments, userTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getComments(postId: number) {
    try {
        const result = await db
            .select({
                id: comments.id,
                content: comments.content,
                created_at: comments.created_at,
                user: {
                    id: userTable.id,
                    username: userTable.username
                }
            })
            .from(comments)
            .innerJoin(userTable, eq(comments.user_id, userTable.id))
            .where(eq(comments.photo_id, postId))
            .orderBy(asc(comments.created_at))

        return result;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function addComment(postId: number, userId: number, content: string) {
    try {
        if (!content.trim() || userId === -1) return null;

        const [result] = await db.insert(comments)
            .values({
                photo_id: postId,
                user_id: userId,
                content: content.trim(),
            })
            .returning();

        // Get the user info to return with the comment
        const user = await db
            .select({
                id: userTable.id,
                username: userTable.username
            })
            .from(userTable)
            .where(eq(userTable.id, userId))
            .limit(1);

        return { ...result, user: user[0] };
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
}