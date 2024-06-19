import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { deleteUserById, getUserById } from "@/repositories/users";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deleteUserFormSchema } from "../../schema";
import { UserType } from "@/types/user";

// update type if we were to return any data back to the response
export type FetchDeleteUser = Record<string, never>;

type Params = { params: { user_id: string } };
const successMessage = "Delete user successfully";
const unsuccessMessage = "Delete user failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_USERS]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        let data: z.infer<typeof deleteUserFormSchema> = {
            userId: String(params.user_id),
        };
        const validationResult = deleteUserFormSchema.safeParse(data);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        data = validationResult.data;

        const existingUser = await getUserById(data.userId);
        if (!existingUser) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        if (user.id === data.userId) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "You are not allowed to delete your own account",
                ),
                HttpStatusCode.NOT_ACCEPTABLE_406,
            );
        }

        if (
            user.type !== UserType.SUPER_ADMIN &&
            existingUser.type === UserType.SUPER_ADMIN
        ) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "You are not allowed to delete super admin account",
                ),
                HttpStatusCode.NOT_ACCEPTABLE_406,
            );
        }

        const deleteResult = await deleteUserById(data.userId);
        // if no row is affected, meaning that the user didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        return buildSuccessResponse<FetchDeleteUser>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
