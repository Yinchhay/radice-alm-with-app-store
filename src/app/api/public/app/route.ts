import { lucia } from "@/auth/lucia";
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
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // const authorizationHeader = request.headers.get("Authorization");
        // const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        // if (!sessionId) {
        //     return buildNoBearerTokenErrorResponse();
        // }

        // const session = await lucia.validateSession(sessionId);
        // if (!session?.session) {
        //     return buildNoPermissionErrorResponse();
        // }

        // const testerId = session.session.userId;

        // const [tester] = await db
        //     .select()
        //     .from(testers)
        //     .where(eq(testers.id, testerId))
        //     .limit(1);

        // if (!tester) {
        //     return buildNoPermissionErrorResponse();
        // }

        const apps = await getAllAcceptedApps();

        return buildSuccessResponse("Get accepted apps successfully", {
            apps,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse("Get accepted apps failed", error);
    }
}
