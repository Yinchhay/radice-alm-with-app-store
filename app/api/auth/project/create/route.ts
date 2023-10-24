import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, getPageSession } from "@/auth/lucia";
import { cookies } from "next/headers";

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

export async function POST(request: NextRequest) {
    try {
        const body: IBody = await request.json()

        if (!body.name || !body.description || !body.year ||
            !body.phase || !body.components || !body.category_id) {
            return NextResponse.json({
                message: "Required field is/are missing"
            }, {
                status: 400
            });
        }

        const session = await getPageSession();

        if (!session) return NextResponse.json({
            message: "Unauthorized, user must login in order to create a project"
        }, {
            status: 401
        });

        const authRequest = auth.handleRequest({
            request,
            cookies
        });
        
        authRequest.setSession(session);

        const project = prisma.projects.create({
            data: {
                name: body.name,
                image: body.image || undefined,
                description: body.description,
                year: body.year,
                phase: body.phase,
                is_public: body.is_public || undefined,
                components: body.components,
                documents: body.documents || undefined,
                links: body.links || undefined,
                user_id: session.user.userId,
                partner_id: body.partner_id || undefined,
                category_id: body.category_id
            }
        });

        await prisma.$transaction([project]);

        return NextResponse.json({
            message: "Project created successfully",
            project: project
        }, {
            status: 201
        });

    } catch (e) {
        // this part depends on the database you're using
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