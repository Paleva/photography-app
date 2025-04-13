import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/app/(public)/auth/session';

const publicRoutes = ['/login', '/register', '/'];
const protectedRoutes = ['/upload', '/user'];
const adminRoutes = ['/admin'];
const userRoute = ['/user']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("\nPATH:\n" + path + "\n");

    if (publicRoutes.some(route => path === route || path.startsWith(`${route}?`))) {
        return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.includes(path);
    const isUserRoute = userRoute.some(route => path.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
    const session = await verifySession();

    if (isAdminRoute && session.role?.toLowerCase() !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if ((isProtectedRoute || isUserRoute) && !session.isAuth) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/upload',
        '/admin',
        '/api/upload/:path*',
        '/user/:path*',
    ]
}