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
import { createUser, GetUsers_C_Tag } from "@/repositories/users";
import { MysqlErrorCodes } from "@/types/db";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createUserFormSchema } from "../schema";
import { GetProjects_C_Tag, OneAssociatedProject_C_Tag } from "@/repositories/project";

export type FetchCreateUser = Record<string, never>;

const successMessage = "Create user successfully";
const unsuccessMessage = "Create user failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_USERS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        const body: z.infer<typeof createUserFormSchema> =
            await request.json();
        const validationResult = createUserFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createUser(body);
        // if no row is affected, meaning that creating user failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        await revalidateTags<GetUsers_C_Tag | OneAssociatedProject_C_Tag | GetProjects_C_Tag>("getUsers_C", "OneAssociatedProject_C_Tag", "getProjects_C_Tag");
        return buildSuccessResponse<FetchCreateUser>(successMessage, {});
    } catch (error: any) {
        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "User name already exists",
                ),
                HttpStatusCode.CONFLICT_409,
            );
        }

        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
