import { NextResponse } from 'next/server'
import { auth } from '@/auth/lucia';
import { Session } from '@/types';

enum StatusCodes {
    Unauthorized = 401,
    Authorized = 200,
}

export async function GET(request: NextResponse) {

    try {
        const sessionId = request.cookies.get('auth_session')?.value;

        if (!sessionId) return NextResponse.json({
            message: "Unauthorized, user must login",
            status: StatusCodes.Unauthorized,
        }, {
            status: StatusCodes.Unauthorized
        });

        const session = await auth.validateSession(sessionId) as Session;

        if (!session) return NextResponse.json({
            message: "Unauthorized, user must login",
            status: StatusCodes.Unauthorized,
        }, {
            status: StatusCodes.Unauthorized
        });

        return NextResponse.json({
            message: "User is verified",
            status: StatusCodes.Authorized,
        }, {
            status: StatusCodes.Authorized,
            headers: request.headers,
        });
    } catch (error) {
        // if session is not valid lucia will throw an error meaning the user is either not logged in or the session is expired
        return NextResponse.json({
            message: "Unauthorized, user must login",
            status: StatusCodes.Unauthorized,
        }, {
            status: StatusCodes.Unauthorized
        });
    }
}