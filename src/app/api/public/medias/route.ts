import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getAllMedias } from "@/repositories/media";
import { NextRequest } from "next/server";

export type GetPublicMediasReturnType = Awaited<
    ReturnType<typeof getAllMedias>
>;

export type PublicMedias =
    GetPublicMediasReturnType extends Array<infer Item> ? Item : never;

export type FetchPublicMediasData = {
    medias: GetPublicMediasReturnType;
};

const successMessage = "Get public medias successfully";
const unsuccessMessage = "Get public medias failed";

// This api return only medias that have projects and the projects are public
export async function GET(request: NextRequest) {
    try {
        const medias = await getAllMedias();

        return buildSuccessResponse<FetchPublicMediasData>(successMessage, {
            medias: medias,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
