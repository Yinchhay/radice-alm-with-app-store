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
import { editRoleById } from "@/repositories/role";
import { GetUserRolesAndRolePermissions_C_Tag } from "@/repositories/users";

import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editRoleByIdSchema } from "../../schema";

export type FetchEditRole = Record<string, never>;

type Params = { params: { role_id: string } };
const successMessage = "Edit role successfully";
const unsuccessMessage = "Edit role failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.EDIT_ROLES]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let body: z.infer<typeof editRoleByIdSchema> = await request.json();
        body.roleId = Number(params.role_id);
        const validationResult = editRoleByIdSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const editResult = await editRoleById(body);

        // Check if the edit operation was successful
        // if (editResult.affectedRows < 1) {
        //     return buildErrorResponse(
        //         unsuccessMessage,
        //         generateAndFormatZodError("unknown", ErrorMessage.NotFound),
        //         HttpStatusCode.NOT_FOUND_404,
        //     );
        // }

        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>("getUserRolesAndRolePermissions_C");
        return buildSuccessResponse<FetchEditRole>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
