import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicProjectsByCategories } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectsByCategoriesReturnType = Awaited<
    ReturnType<typeof getPublicProjectsByCategories>
>;

export type FetchPublicProjectsCategoriesData = {
    categories: GetPublicProjectsByCategoriesReturnType;
};

export type PublicProjectsAndCategory =
    GetPublicProjectsByCategoriesReturnType extends Array<infer Item>
        ? Item
        : never;

const successMessage = "Get public projects by categories successfully";
const unsuccessMessage = "Get public projects by categories failed";

// This api return only categories that have projects and the projects are public
export async function GET(request: NextRequest) {
    try {
        const categories = await getPublicProjectsByCategories();

        return buildSuccessResponse<FetchPublicProjectsCategoriesData>(
            successMessage,
            {
                categories: categories,
            },
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
