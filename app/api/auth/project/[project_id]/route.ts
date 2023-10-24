import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface IParams {
    params: { project_id: string }
}

export async function GET(request: Request, { params }: IParams) {
    const project = await prisma.projects.findFirst({
        where: {
            id: Number(params.project_id)
        },
    })
    
    if (project) {
        return NextResponse.json({
            message: "project has been found",
            project: project,
            status: 200,
        }, {
            status: 200
        });
    }

    return NextResponse.json({
        message: "project does not found",
        status: 404,
    }, {
        status: 404
    });
}