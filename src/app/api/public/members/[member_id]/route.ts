import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getUserById } from "@/repositories/users";
import { NextRequest } from "next/server";

export type GetPublicMemberByIdReturnType = Awaited<
    ReturnType<typeof getUserById>
>;

export type FetchPublicMemberByIdData = {
    member: GetPublicMemberByIdReturnType;
};
type Params = { params: { member_id: string } };

const successMessage = "Get public member by id successfully";
const unsuccessMessage = "Get public member by id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const member = await getUserById(
            params.member_id,
        );

        return buildSuccessResponse<FetchPublicMemberByIdData>(successMessage, {
            member: member,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
