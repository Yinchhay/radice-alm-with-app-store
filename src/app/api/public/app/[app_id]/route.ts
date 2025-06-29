import { checkAndBuildErrorResponse, buildSuccessResponse } from "@/lib/response";
import { getAppById } from "@/repositories/app";
import { NextRequest } from "next/server";

type Param = { params: { app_id: string } };
export async function GET(request: NextRequest, { params }: Param) {
    try {
        const appID = parseInt(params.app_id);
        if (isNaN(appID)){
            return checkAndBuildErrorResponse("Invalid app ID", new Error("App ID must be a number"));
        }

        const app = await getAppById(appID);
        if (!app) {
            return checkAndBuildErrorResponse("App not found", new Error("No app found with the provided ID"));
        }
        return buildSuccessResponse("Get app by ID successfully", {app})
    } catch (error) {
        console.error("Error fetching app:", error);
        return checkAndBuildErrorResponse("Failed to fetch app", error);
    }
}