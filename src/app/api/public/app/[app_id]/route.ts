import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getAppByIdForPublic } from "@/repositories/app";
import { NextRequest } from "next/server";

export type GetPublicAppByIdReturnType = Awaited<
    ReturnType<typeof getAppByIdForPublic>
>;

export type FetchPublicAppByIdData = {
    app: GetPublicAppByIdReturnType;
};

type Params = { params: { app_id: string } };

const successMessage = "Get public app by id successfully";
const unsuccessMessage = "Get public app by id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const appID = parseInt(params.app_id);
        if (isNaN(appID)) {
            return checkAndBuildErrorResponse("Invalid app ID", new Error("App ID must be a number"));
        }

        const app = await getAppByIdForPublic(appID);
        if (!app) {
            return checkAndBuildErrorResponse("App not found", new Error("No app found with the provided ID"));
        }

        return buildSuccessResponse<FetchPublicAppByIdData>(
            successMessage,
            {
                app: app,
            },
        );
    } catch (error: any) {
        console.error("Error fetching app:", error);
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
