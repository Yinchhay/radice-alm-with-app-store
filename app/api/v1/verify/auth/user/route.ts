import { NextResponse } from 'next/server'
import { getPageSession } from '@/auth/lucia';
import { HttpStatusCode } from '@/types/server';

export async function GET(request: NextResponse) {
    try {
        const session = await getPageSession();

        if (!session) return NextResponse.json({
            message: "Unauthorized, user must login",
            status: HttpStatusCode.UNAUTHORIZED_401,
        }, {
            status: HttpStatusCode.UNAUTHORIZED_401
        });

        return NextResponse.json({
            message: "User is verified",
            status: HttpStatusCode.OK_200,
        }, {
            status: HttpStatusCode.OK_200,
            headers: request.headers,
        });
    } catch (error) {
        // if session is not valid lucia will throw an error meaning the user is either not logged in or the session is expired
        return NextResponse.json({
            message: "Unauthorized, user must login",
            status: HttpStatusCode.UNAUTHORIZED_401,
        }, {
            status: HttpStatusCode.UNAUTHORIZED_401
        });
    }
}