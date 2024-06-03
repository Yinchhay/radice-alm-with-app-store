import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicProjectsByCategory } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectsByCategoryReturnType = Awaited<
    ReturnType<typeof getPublicProjectsByCategory>
>;

export type FetchPublicProjectsCategoriesData = {
    projects: GetPublicProjectsByCategoryReturnType;
};
type Params = { params: { category_id: string } };

const successMessage = "Get public projects by category successfully";
const unsuccessMessage = "Get public projects by category failed";

// This api return only categories that have projects and the projects are public
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const projects = await getPublicProjectsByCategory(
            Number(params.category_id),
        );

        return buildSuccessResponse<FetchPublicProjectsCategoriesData>(
            successMessage,
            {
                projects: projects,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
