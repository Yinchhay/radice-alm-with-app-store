import { NextRequest } from "next/server";

import {
    buildSuccessResponse,
    checkAndBuildErrorResponse,
} from "@/lib/response";
import { getAllAcceptedApps } from "@/repositories/app/public";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const apps = await getAllAcceptedApps();

        return buildSuccessResponse("Get accepted apps successfully", {
            apps,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse("Get accepted apps failed", error);
    }
}
