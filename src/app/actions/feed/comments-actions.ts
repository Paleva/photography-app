'use server'

import { verifySession } from "@/app/(public)/auth/session";
import { db, comments, users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getComments(postId: number) {
    try {
        const result = await db
            .select({
                id: comments.id,
                comment_text: comments.comment_text,
                created_at: comments.created_at,
                user: {
                    id: users.id,
                    username: users.username,
                    avatar: users.profile_picture,
                }
            })
            .from(comments)
            .innerJoin(users, eq(comments.user_id, users.id))
            .where(eq(comments.post_id, postId))
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

        const sesion = await verifySession();
        if (!sesion.isAuth || sesion.userId !== userId) {
            return null;
        }


        const [result] = await db.insert(comments)
            .values({
                post_id: postId,
                user_id: userId,
                comment_text: content.trim(),
            })
            .returning();

        // Get the user info to return with the comment
        const user = await db
            .select({
                id: users.id,
                username: users.username,
                avatar: users.profile_picture,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return { ...result, user: user[0] };
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
}