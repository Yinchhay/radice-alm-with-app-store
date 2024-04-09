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
import { createProject, GetProjects_C_Tag } from "@/repositories/project";
import { MysqlErrorCodes } from "@/types/db";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createProjectFormSchema } from "../schema";

export type FetchCreateProject = Record<string, never>;

const successMessage = "Create project successfully";
const unsuccessMessage = "Create project failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_OWN_PROJECTS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        const body: z.infer<typeof createProjectFormSchema> =
            await request.json();
        const validationResult = createProjectFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createProject(body);
        // if no row is affected, meaning that creating project failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        await revalidateTags<GetProjects_C_Tag>("getProjects_C_Tag");
        return buildSuccessResponse<FetchCreateProject>(successMessage, {});
    } catch (error: any) {
        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "Project name already exists",
                ),
                HttpStatusCode.CONFLICT_409,
            );
        }

        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
