import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPageSession } from "@/auth/lucia";

interface IBody {
    name: string,
    image?: Record<string, any>,
    description: string,
    year: string,
    phase: string,
    is_public?: boolean,
    components: Record<string, any>,
    documents?: Record<string, any>,
    links?: Record<string, any>,
    user_id: string,
    partner_id?: number,
    category_id: number,
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body: IBody = await request.json()

        const oldProject = await prisma.projects.findFirst({
            where: {
                id: Number(params.id)
            }
        });

        if (!oldProject) return NextResponse.json({
            message: "Project not found"
        }, {
            status: 404
        });

        const session = await getPageSession();

        if (!session) return NextResponse.json({
            message: "Unauthorized, user must login in order to update a project"
        }, {
            status: 401
        });

        if (oldProject?.user_id != session.user.userId) return NextResponse.json({
            message: "Unauthorized, user must be the owner of this project to update it"
        }, {
            status: 401
        });

        const project = prisma.projects.update({
            where: { id: Number(params.id) },
            data: body
        });

        await prisma.$transaction([project]);

        return NextResponse.json({
            message: "Project updated successfully",
            project: project
        }, {
            status: 201
        });

    } catch (e) {
        console.log(e);

        return NextResponse.json({
            error: "An unknown error occurred :(",
            e: e,
        }, {
            status: 500
        }
        );
    }
}