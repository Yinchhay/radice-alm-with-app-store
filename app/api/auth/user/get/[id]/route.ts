import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// import { auth } from '@/auth/lucia'

interface IParams {
    params: { id: string }
}

export async function GET(request: Request, { params }: IParams) {
    const user = await prisma.users.findFirst({
        where: {
            id: params.id
        },
        // include only a specific field of the user
        select: {
            username: true,
        }
    })
    
    if (user) {
        // this is just a test
        // const key = await auth.getKey('github', user.github_id as string);
        // const userFromKey = await auth.getUser(key.userId);

        return NextResponse.json({
            message: "user has been found",
            // user: userFromKey,
            user: user,
            status: 200,
        }, {
            status: 200
        });
    }

    return NextResponse.json({
        message: "user does not found",
        status: 404,
    }, {
        status: 404
    });
}