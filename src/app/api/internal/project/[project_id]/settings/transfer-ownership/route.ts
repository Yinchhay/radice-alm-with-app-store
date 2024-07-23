import { checkBearerAndPermission } from "@/lib/IAM";
import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import {
    getOneAssociatedProject,
    transferProjectOwnership,
} from "@/repositories/project";
import { ProjectRole, checkProjectRole } from "@/lib/project";
import { transferProjectOwnershipSchema } from "../../schema";
import { getUserByEmail } from "@/repositories/users";
import { UserType } from "@/types/user";

const successMessage = "Successfully transfer project ownership";
const unsuccessMessage = "Failed to transfer project ownership";

type Params = { params: { project_id: string } };
export type FetchTransferProjectOwnershipData = Record<string, unknown>;

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let body: z.infer<typeof transferProjectOwnershipSchema> =
            await request.json();
        const validationResult = transferProjectOwnershipSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const project = await getOneAssociatedProject(
            Number(params.project_id),
        );
        if (!project) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "Project does not exist"),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        const { projectRole } = checkProjectRole(user.id, project, user.type);
        if (
            projectRole !== ProjectRole.OWNER &&
            projectRole !== ProjectRole.SUPER_ADMIN
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Unauthorized to transfer project",
                ),
                HttpStatusCode.UNAUTHORIZED_401,
            );
        }

        const transferToUser = await getUserByEmail(body.email);
        if (!transferToUser) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", "User does not exist"),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (project.userId === transferToUser.id) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "User is already the owner of the project",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (
            transferToUser.type !== UserType.SUPER_ADMIN &&
            transferToUser.type !== UserType.USER
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "User does not qualify to own this project.",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        await transferProjectOwnership(
            Number(params.project_id),
            transferToUser.id,
            project.userId,
        );

        return buildSuccessResponse<FetchTransferProjectOwnershipData>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
