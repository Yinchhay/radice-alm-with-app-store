import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicCategoriesWhereItHasProjects } from "@/repositories/category";
import { NextRequest } from "next/server";

export type GetPublicCategoriesReturnType = Awaited<
    ReturnType<typeof getPublicCategoriesWhereItHasProjects>
>;

export type FetchPublicCategoriesData = {
    categories: GetPublicCategoriesReturnType;
};

const successMessage = "Get public categories successfully";
const unsuccessMessage = "Get public categories failed";

// This api return only categories that have projects and the projects are public
export async function GET(request: NextRequest) {
    try {
        const categories = await getPublicCategoriesWhereItHasProjects();

        return buildSuccessResponse<FetchPublicCategoriesData>(successMessage, {
            categories: categories,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
