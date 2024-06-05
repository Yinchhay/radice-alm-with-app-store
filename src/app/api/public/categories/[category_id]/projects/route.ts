import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicProjectsByCategoryId } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectsByCategoryIdReturnType = Awaited<
    ReturnType<typeof getPublicProjectsByCategoryId>
>;

export type FetchPublicProjectsByCategoryIdData = {
    projects: GetPublicProjectsByCategoryIdReturnType;
};
type Params = { params: { category_id: string } };

const successMessage = "Get public projects by category id successfully";
const unsuccessMessage = "Get public projects by category id failed";

// This api return only category id that have projects and the projects are public
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const projects = await getPublicProjectsByCategoryId(
            Number(params.category_id),
        );

        return buildSuccessResponse<FetchPublicProjectsByCategoryIdData>(
            successMessage,
            {
                projects: projects,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
