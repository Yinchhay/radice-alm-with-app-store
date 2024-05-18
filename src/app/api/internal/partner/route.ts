import { checkBearerAndPermission, routeRequiredPermissions } from "@/lib/IAM";
import {
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { getPartners } from "@/repositories/partner";
import { NextRequest } from "next/server";

type GetPartnersReturnType = Awaited<ReturnType<typeof getPartners>>;

export type FetchPartnersData = {
    partners: GetPartnersReturnType;
};

const successMessage = "Get partners successfully";
const unsuccessMessage = "Get partners failed";

export async function GET(request: NextRequest) {
    try {
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(
                request,
                routeRequiredPermissions.get("managePartners")!,
            );
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const partners = await getPartners();

        return buildSuccessResponse<FetchPartnersData>(successMessage, {
            partners: partners,
        });
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
