import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/app/(public)/auth/session';

const publicRoutes = ['/login', '/register', '/'];
const protectedRoutes = ['/upload'];
const userRoute = ['/user']
// const publicRoutes = ['/login', '/register', '/'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("\nPATH:\n" + path)

    if (publicRoutes.some(route => path === route || path.startsWith(`${route}?`))) {
        return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.includes(path);
    const isUserRoute = userRoute.some(route => path.startsWith(route));

    const session = await verifySession();

    if ((isProtectedRoute || isUserRoute) && !session.isAuth) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // if (isUserRoute) {
    //     if (!session.isAuth) {
    //         return NextResponse.redirect(new URL('/login', req.nextUrl))
    //     }
    //     if (path.startsWith('/user/')) {
    //         const pathParts = path.split('/');
    //         if (pathParts.length >= 3) {
    //             const username = pathParts[2];
    //             if (username !== session.username) {
    //                 return NextResponse.redirect(new URL('/login', req.nextUrl))
    //             }
    //         }
    //     }
    // }

    return NextResponse.next();
}


// export const config = {
//     matcher: [
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         '/(api/trpc)(.*)',
//         '/user/:username*',
//     ]
// }
export const config = {
    matcher: [
        // Static files and resources to ignore
        // API routes
        '/api/:path*',
        // User routes
        '/user/:path*',
    ]
}