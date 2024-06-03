import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getAllUsers } from "@/repositories/users";
import { NextRequest } from "next/server";

export type GetPublicMemberReturnType = Awaited<ReturnType<typeof getAllUsers>>;

export type PublicMember =
    GetPublicMemberReturnType extends Array<infer Item> ? Item : never;

export type FetchPublicMemberData = {
    members: GetPublicMemberReturnType;
};

const successMessage = "Get public member successfully";
const unsuccessMessage = "Get public member failed";

// This api return only member that have projects and the projects are public
export async function GET(request: NextRequest) {
    try {
        const member = await getAllUsers(
            Boolean(request.nextUrl.searchParams.get("hasLinkedGithub")),
        );

        return buildSuccessResponse<FetchPublicMemberData>(successMessage, {
            members: member,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
