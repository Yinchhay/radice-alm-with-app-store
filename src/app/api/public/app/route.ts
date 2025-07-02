import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import {
    buildSuccessResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
} from "@/lib/response";
import { getAllAcceptedApps } from "@/repositories/app/public";
import { db } from "@/drizzle/db";
import { testers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const authorizationHeader = request.headers.get("Authorization");
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return buildNoBearerTokenErrorResponse();
        }

        const token = authorizationHeader.replace("Bearer ", "");

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return buildNoPermissionErrorResponse();
        }

        const testerId = payload.id;
        if (!testerId) {
            return buildNoPermissionErrorResponse();
        }

        const [tester] = await db
            .select()
            .from(testers)
            .where(eq(testers.id, testerId))
            .limit(1);

        if (!tester) {
            return buildNoPermissionErrorResponse();
        }

        const apps = await getAllAcceptedApps();

        return buildSuccessResponse("Get accepted apps successfully", {
            apps,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse("Get accepted apps failed", error);
    }
}
