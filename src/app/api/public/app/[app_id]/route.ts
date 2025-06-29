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
        const app = await getAppByIdForPublic(
            Number(params.app_id),
        );

        return buildSuccessResponse<FetchPublicAppByIdData>(
            successMessage,
            {
                app: app,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}