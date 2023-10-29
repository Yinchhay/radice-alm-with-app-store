import prisma from "@/lib/prisma";
import { HttpStatusCode, ResponseMessage, ResponseStatus } from "@/types/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const roles = await prisma.roles.findMany();
        
        return NextResponse.json({
            message: ResponseMessage.SUCCESS,
            data: { roles: roles },
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