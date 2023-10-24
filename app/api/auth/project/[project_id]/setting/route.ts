import { NextResponse } from 'next/server'

interface IParams {
    params: { id: string }
}

export async function POST(request: Request, { params }: IParams) {
    const body = await request.json();

    return NextResponse.json({
        message: "received the body",
        body: body,
        status: 200,
    }, {
        status: 200
    });
}