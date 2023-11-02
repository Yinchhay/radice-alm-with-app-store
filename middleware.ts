import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers';
import { HttpStatusCode, ResponseMessage, ResponseStatus } from './types/server';
import { serverUrlPath } from './utils';

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

    if (pathname.startsWith('/app')) {

        const res = await fetch(serverUrlPath(`/api/v1/verify/auth/user`), {
            credentials: 'include',
            mode: "no-cors",
            cache: "no-store",
            headers: request.headers,
        });

        const json = await res.json();
        if (json.status == HttpStatusCode.OK_200) return NextResponse.next();

        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/api/v1/auth')) {

        const res = await fetch(serverUrlPath(`/api/v1/verify/auth/user`), {
            credentials: 'include',
            mode: "no-cors",
            cache: "no-store",
            headers: request.headers,
        });

        const json = await res.json();
        
        if (json.success) return NextResponse.next();

        return NextResponse.json({
            message: ResponseMessage.UNAUTHORIZED,
            data: {},
            success: ResponseStatus.UNSUCCESSFUL,
            status: HttpStatusCode.UNAUTHORIZED_401
        }, {
            status: HttpStatusCode.UNAUTHORIZED_401
        });
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