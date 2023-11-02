import { NextResponse } from 'next/server'
import { getPageSession } from '@/auth/lucia';
import { HttpStatusCode, ResponseMessage, ResponseStatus } from '@/types/server';

export async function GET(request: NextResponse) {
    try {
        const session = await getPageSession();

        if (!session) return NextResponse.json({
            message: ResponseMessage.UNAUTHORIZED,
            success: ResponseStatus.UNSUCCESSFUL,
            status: HttpStatusCode.UNAUTHORIZED_401,
        }, {
            status: HttpStatusCode.UNAUTHORIZED_401
        });

        return NextResponse.json({
            message: ResponseMessage.SUCCESS,
            success: ResponseStatus.SUCCESS,
            status: HttpStatusCode.OK_200,
        }, {
            status: HttpStatusCode.OK_200,
            headers: request.headers,
        });
    } catch (error) {
        // if session is not valid lucia will throw an error meaning the user is either not logged in or the session is expired
        return NextResponse.json({
            message: ResponseMessage.UNAUTHORIZED,
            success: ResponseStatus.UNSUCCESSFUL,
            status: HttpStatusCode.UNAUTHORIZED_401,
        }, {
            status: HttpStatusCode.UNAUTHORIZED_401
        });
    }
}