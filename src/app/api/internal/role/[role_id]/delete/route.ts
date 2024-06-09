import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { revalidateTags } from "@/lib/server_utils";
import {
    deleteRoleById,
    GetRoles_C_Tag,
} from "@/repositories/role";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deleteRoleFormSchema } from "../../schema";

// update type if we were to return any data back to the response
export type FetchDeleteRole = Record<string, never>;

type Params = { params: { role_id: string } };
const successMessage = "Delete role successfully";
const unsuccessMessage = "Delete role failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_ROLES]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let data: z.infer<typeof deleteRoleFormSchema> = {
            roleId: Number(params.role_id),
        };
        const validationResult = deleteRoleFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        data = validationResult.data;

        const deleteResult = await deleteRoleById(data.roleId);
        // if no row is affected, meaning that the role didn't get deleted
        if (deleteResult.rolesAffectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        return buildSuccessResponse<FetchDeleteRole>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
