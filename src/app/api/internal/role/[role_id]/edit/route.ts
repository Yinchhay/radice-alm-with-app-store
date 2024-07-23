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
import { editRoleById, getRoleById, getUsersInRole } from "@/repositories/role";
import { GetUserRolesAndRolePermissions_C_Tag } from "@/repositories/users";

import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { editRoleByIdSchema } from "../../schema";
import {
    findItemsToBeCreated,
    findItemsToBeDeleted,
    PermissionsToFilterIfNotSuperAdmin,
} from "@/lib/filter";
import { UserType } from "@/types/user";

export type FetchEditRole = Record<string, never>;

type Params = { params: { role_id: string } };
const successMessage = "Edit role by id successfully";
const unsuccessMessage = "Edit role by id failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([Permissions.EDIT_ROLES]);
        const { errorNoBearerToken, errorNoPermission, user } =
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

        const [role, usersInRole] = await Promise.all([
            getRoleById(body.roleId, user.type),
            getUsersInRole(body.roleId),
        ]);

        let usersToAdd: string[] = findItemsToBeCreated(
            body.userIds as string[],
            usersInRole,
            "id",
        );

        let usersToRemove: string[] = findItemsToBeDeleted(
            body.userIds as string[],
            usersInRole,
            "id",
        ).map((user) => user.id);

        const permissions = role?.rolePermissions.map(
            (rolePermission) => rolePermission.permission,
        );
        let permissionsToAdd: number[] = findItemsToBeCreated(
            body.permissionIds as number[],
            permissions ?? [],
            "id",
        );
        let permissionsToRemove: number[] = findItemsToBeDeleted(
            body.permissionIds as number[],
            permissions ?? [],
            "id",
        ).map((permission) => permission.id);

        if (user.type !== UserType.SUPER_ADMIN) {

            const hasForbiddenPermissionToAdd = permissionsToAdd.some(
                (permissionId) =>
                    PermissionsToFilterIfNotSuperAdmin.includes(permissionId),
            );

            if (hasForbiddenPermissionToAdd) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "permission",
                        "You are not allowed to add permission related to roles",
                    ),
                    HttpStatusCode.FORBIDDEN_403,
                );
            }

            const hasForbiddenPermissionToRemove = permissionsToRemove.some(
                (permissionId) =>
                    PermissionsToFilterIfNotSuperAdmin.includes(permissionId),
            );

            if (hasForbiddenPermissionToRemove) {
                return buildErrorResponse(
                    unsuccessMessage,
                    generateAndFormatZodError(
                        "permission",
                        "You are not allowed to remove permission related to roles",
                    ),
                    HttpStatusCode.FORBIDDEN_403,
                );
            }
        }

        const editResult = await editRoleById(
            body.roleId,
            usersToAdd,
            usersToRemove,
            permissionsToAdd,
            permissionsToRemove,
            body.name === role?.name ? undefined : body.name,
        );

        await revalidateTags<GetUserRolesAndRolePermissions_C_Tag>(
            "getUserRolesAndRolePermissions_C",
        );
        return buildSuccessResponse<FetchEditRole>(successMessage, {});
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
