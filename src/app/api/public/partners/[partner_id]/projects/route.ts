import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPublicProjectsByPartnerId } from "@/repositories/project";
import { NextRequest } from "next/server";

export type GetPublicProjectsByPartnerIdReturnType = Awaited<
    ReturnType<typeof getPublicProjectsByPartnerId>
>;

export type FetchPublicProjectsByIdData = {
    projects: GetPublicProjectsByPartnerIdReturnType;
};
type Params = { params: { partner_id: string } };

const successMessage = "Get public projects by partner id successfully";
const unsuccessMessage = "Get public projects by partner  id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const projects = await getPublicProjectsByPartnerId(params.partner_id);

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
