import { NextRequest, NextResponse } from 'next/server';
import { decrypt, verifySession } from '@/app/(public)/auth/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/home', '/upload', "/profile", '/user/liked', '/user/uploads'];
// const publicRoutes = ['/login', '/register', '/'];

export default async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    // const cookie = (await cookies()).get('session')?.value;
    const session = await verifySession();

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api/trpc)(.*)'
    ]
}