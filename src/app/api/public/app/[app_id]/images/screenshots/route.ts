import { checkBearerAndPermission } from "@/lib/IAM";
import { generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { NextRequest } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getAppScreenshots } from "@/repositories/app_screenshot";

const unsuccessMessage = "Failed to retrieve app screenshots";

export async function GET(request: NextRequest, { params }: Params) {
    try {

        const appId = Number(params.app_id);

        if (isNaN(appId) || appId <= 0) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("app_id", "Invalid app ID"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const screenshots = await getAppScreenshots(appId);

        return buildSuccessResponse("Screenshots retrieved successfully", {
            screenshots: screenshots || [],
        });
    } catch (error: any) {
        return buildErrorResponse(
            unsuccessMessage,
            generateAndFormatZodError(
                "unknown",
                `Server error: ${error.message}`,
            ),
            HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        );
    }
}