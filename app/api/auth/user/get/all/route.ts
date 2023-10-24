import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const result = await prisma.users.findMany();

    if (result) {
        return NextResponse.json({
            message: "all users has been queried",
            users: result,
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