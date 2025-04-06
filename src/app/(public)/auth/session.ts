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
        .setExpirationTime('7d')
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

    if (!session) {
        return { isAuth: false };
    }

    return { isAuth: true, userId: Number(session.userId), username: String(session.username), role: String(session.role) };
}


export async function createSession(id: number, username: string, role: string = 'user') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: id, username, expiresAt, role })

        ; (await cookies()).set('session', session, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'lax',
            path: '/'
        })

    redirect('/')
}


export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/')
}

export async function deleteCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function getSession() {
    const cookie = (await cookies()).get('session')?.value;
    return await decrypt(cookie);
}