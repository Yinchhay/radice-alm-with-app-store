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
import { editRoleById, GetRoles_C_Tag } from "@/repositories/role";
import { MysqlErrorCodes } from "@/types/db";
import { ErrorMessage } from "@/types/error";
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

        const body: z.infer<typeof editRoleByIdSchema> = await request.json();
        body.roleId = Number(params.role_id);
        const validationResult = editRoleByIdSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const editResult = await editRoleById(body);

        // Check if the edit operation was successful
        // if (editResult.affectedRows < 1) {
        //     return buildErrorResponse(
        //         unsuccessMessage,
        //         generateAndFormatZodError("unknown", ErrorMessage.NotFound),
        //         HttpStatusCode.NOT_FOUND_404,
        //     );
        // }

        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        return buildSuccessResponse<FetchEditRole>(successMessage, {});
    } catch (error: any) {
        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "Role name already exists",
                ),
                HttpStatusCode.CONFLICT_409,
            );
        }

        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
