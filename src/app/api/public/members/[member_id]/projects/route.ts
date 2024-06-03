import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicProjectsByUserId } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectsByUserIdReturnType = Awaited<
    ReturnType<typeof getPublicProjectsByUserId>
>;

export type FetchPublicProjectsByIdData = {
    projects: GetPublicProjectsByUserIdReturnType;
};
type Params = { params: { member_id: string } };

const successMessage = "Get public projects by user id successfully";
const unsuccessMessage = "Get public projects by user  id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const projects = await getPublicProjectsByUserId(params.member_id);

        return buildSuccessResponse<FetchPublicProjectsByIdData>(
            successMessage,
            {
                projects: projects,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
