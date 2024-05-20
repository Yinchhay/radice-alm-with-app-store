import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { revalidateTags } from "@/lib/server_utils";
import { deletePartnerById, GetPartners_C_Tag } from "@/repositories/partner";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deletePartnerFormSchema } from "../../schema";
import {
    GetProjects_C_Tag,
    OneAssociatedProject_C_Tag,
} from "@/repositories/project";

// update type if we were to return any data back to the response
export type FetchDeletePartner = Record<string, never>;

type Params = { params: { partner_id: string } };
const successMessage = "Delete partner successfully";
const unsuccessMessage = "Delete partner failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_PARTNERS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const data: z.infer<typeof deletePartnerFormSchema> = {
            partnerId: params.partner_id,
        };
        const validationResult = deletePartnerFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const deleteResult = await deletePartnerById(data.partnerId);
        // if no row is affected, meaning that the partner didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        await revalidateTags<
            GetPartners_C_Tag | OneAssociatedProject_C_Tag | GetProjects_C_Tag
        >("getPartners_C", "OneAssociatedProject_C_Tag", "getProjects_C_Tag");
        return buildSuccessResponse<FetchDeletePartner>(successMessage, {});
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
