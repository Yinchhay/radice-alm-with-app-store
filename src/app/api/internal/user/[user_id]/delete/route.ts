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
import {
    deleteUserById,
    GetUsers_C_Tag,
} from "@/repositories/users";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { deleteUserFormSchema } from "../../schema";

// update type if we were to return any data back to the response
export type FetchDeleteUser = Record<string, never>;

type Params = { params: { user_id: string } };
const successMessage = "Delete user successfully";
const unsuccessMessage = "Delete user failed";

export async function DELETE(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.DELETE_USERS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const data: z.infer<typeof deleteUserFormSchema> = {
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

        const deleteResult = await deleteUserById(data.userId);
        // if no row is affected, meaning that the user didn't get deleted
        if (deleteResult[0].affectedRows < 1) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", ErrorMessage.NotFound),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        await revalidateTags<GetUsers_C_Tag>("getUsers_C");
        return buildSuccessResponse<FetchDeleteUser>(successMessage, {});
    } catch (error: any) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
