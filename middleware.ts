import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers';
import { HttpStatusCode } from './types/server';

/*
 * As of the time I develop this middleware prisma does not support vercel edge function
 * and next middleware use vercel edge function runtime. Therefore, i implement a workaround  
 * solution by creating an api route to verify user auth session. 
 * 
 * IMPORTANT: when fetching the verify auth api route, make sure to pass the header in order to 
 * pass the cookie
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/auth')) {
        const host = headers().get("host");
        const protocol = process?.env.NODE_ENV === "development" ? "http" : "https"

        const res = await fetch(`${protocol}://${host}/api/v1/verify/auth/user`, {
            credentials: 'include',
            mode: "no-cors",
            cache: "no-store",
            headers: request.headers,
        });

        const json = await res.json();
        if (json.status == HttpStatusCode.OK_200) return NextResponse.next();

        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}