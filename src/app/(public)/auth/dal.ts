import 'server-only';
import { db } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { userTable } from '@/db/schema';
import { verifySession } from './session';


export const getUser = cache(async () => {
    const session = await verifySession();
    if (!session) return null;

    try {
        const data = await db.select({
            id: userTable.id,
            username: userTable.username,
            email: userTable.email
        })
            .from(userTable)
            .where(eq(userTable.id, session.userId))

        const user = data[0];
        console.log(user)
        return user;
    } catch (error) {
        console.log('Failed to fetch user');
        return null;
    }
});