import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";
import { decrypt } from '@/app/(public)/auth/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/home', '/upload'];
// const publicRoutes = ['/login', '/register', '/'];

// export default async function middleware(req: NextRequest) {

//     const path = req.nextUrl.pathname;
//     const isProtectedRoute = protectedRoutes.includes(path);

//     const cookie = (await cookies()).get('session')?.value;
//     const session = await decrypt(cookie);

//     if (isProtectedRoute && !session?.userId) {
//         return NextResponse.redirect(new URL('/login', req.nextUrl));
//     }

//     return NextResponse.next();
// }


export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api/trpc)(.*)'
    ]
}