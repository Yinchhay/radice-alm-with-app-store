import prisma from "@/lib/prisma";
import { HttpStatusCode, ResponseMessage, ResponseStatus } from "@/types/server";
import type { Roles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RemoveKey {
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}

type BodyRole = Omit<Roles, keyof RemoveKey>;

export default async function POST(request: NextRequest) {
    try {
        const body: BodyRole = await request.json();

        if (body.name == undefined || body.description == undefined || body.permission == undefined) {
            return NextResponse.json({
                message: ResponseMessage.BAD_REQUEST_BODY,
                data: {},
                success: ResponseStatus.UNSUCCESSFUL,
                status: HttpStatusCode.BAD_REQUEST_400
            }, {
                status: HttpStatusCode.BAD_REQUEST_400
            });
        }

        const role = await prisma.roles.create({
            data: {
                name: body.name,
                description: body.description,
                permission: body.permission,
            }
        })

        return NextResponse.json({
            message: ResponseMessage.SUCCESS,
            data: { role: role },
            success: ResponseStatus.SUCCESS,
            status: HttpStatusCode.OK_200,
        }, {
            status: HttpStatusCode.OK_200,
        });

    } catch (err) {
        return NextResponse.json({
            message: ResponseMessage.INTERNAL_SERVER_ERROR,
            data: {},
            success: ResponseStatus.UNSUCCESSFUL,
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        }, {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}