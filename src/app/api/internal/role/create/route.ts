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
import { createRole, GetRoles_C_Tag } from "@/repositories/role";
import { MysqlErrorCodes } from "@/types/db";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createRoleFormSchema } from "../schema";

export type FetchCreateRole = Record<string, never>;

const successMessage = "Create role successfully";
const unsuccessMessage = "Create role failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_ROLES]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        const body: z.infer<typeof createRoleFormSchema> =
            await request.json();
        const validationResult = createRoleFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createRole(body);
        // if no row is affected, meaning that creating role failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        await revalidateTags<GetRoles_C_Tag>("getRoles_C");
        return buildSuccessResponse<FetchCreateRole>(successMessage, {});
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
