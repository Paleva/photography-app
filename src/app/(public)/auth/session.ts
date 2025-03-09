import 'server-only'

// import { sessions, db } from "@/db/schema"
import { SessionPayload } from "./definitions"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1hr')
        .sign(key);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify session');
        console.log(error);
        return null;
    }
}

export async function verifySession() {
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        redirect('/login');
    }
    console.log(session.userId)
    return { isAuth: true, userId: Number(session.userId) };
}


export async function createSession(id: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)


    // const data = await db
    //     .insert(sessions)
    //     .values({ user_id: id, expires_at: expiresAt })
    //     .returning({ id: sessions.session_id })

    // const sessionId = data[0].id

    const session = await encrypt({ userId: id, expiresAt })

        ; (await cookies()).set('session', session, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'lax',
            path: '/'
        })

    redirect('/home')
}