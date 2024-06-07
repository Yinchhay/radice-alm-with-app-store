import {
    checkAndBuildErrorResponse,
    buildSuccessResponse,
    buildErrorResponse,
} from "@/lib/response";
import { getPartnerById } from "@/repositories/partner";
import { NextRequest } from "next/server";

export type GetPublicPartnerByIdReturnType = Awaited<
    ReturnType<typeof getPartnerById>
>;

export type FetchPublicPartnerByIdData = {
    partner: GetPublicPartnerByIdReturnType;
};
type Params = { params: { partner_id: string } };

const successMessage = "Get public partner by id successfully";
const unsuccessMessage = "Get public partner by id failed";

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const partner = await getPartnerById(
            params.partner_id,
        );

        if (!partner) {
            return buildErrorResponse(unsuccessMessage, {
                message: "Partner not found",
            });
        }

        return buildSuccessResponse<FetchPublicPartnerByIdData>(successMessage, {
            partner: partner,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
