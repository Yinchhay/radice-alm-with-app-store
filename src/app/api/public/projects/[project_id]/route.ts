import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getProjectByIdForPublic } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectByIdReturnType = Awaited<
    ReturnType<typeof getProjectByIdForPublic>
>;

export type FetchPublicProjectByIdData = {
    project: GetPublicProjectByIdReturnType;
};
type Params = { params: { project_id: string } };

const successMessage = "Get public project by id successfully";
const unsuccessMessage = "Get public project by  id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const project = await getProjectByIdForPublic(
            Number(params.project_id),
        );

        return buildSuccessResponse<FetchPublicProjectByIdData>(
            successMessage,
            {
                project: project,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
