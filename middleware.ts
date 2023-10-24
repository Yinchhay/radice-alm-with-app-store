import { NextResponse } from 'next/server'
import { getPageSession } from './auth/lucia';
import { CustomRequest } from './types';

// if (!session) return NextResponse.json({
//     message: "Unauthorized, user must login"
// }, {
//     status: 401
// });

export async function middleware(request: CustomRequest) {
    // const { pathname } = request.nextUrl;

    // if (pathname.startsWith('/auth')) {
    //     const session = await getPageSession();
    //     if (!session) return NextResponse.redirect(new URL('/login', request.url));
        
    //     request.currentUser = session.user;
    //     return NextResponse.next();
    // }
}