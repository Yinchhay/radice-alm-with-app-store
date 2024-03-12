import { getUserRolesAndRolePermissions_C } from "@/repositories/users";
import { localDebug } from "./utils";

/**
 * This function take a user id and a set of required permissions and return a boolean and a message
 * Brief: get user roles, then get role permissions, then check if the user has the required
 * permission.
 * if the role is not active skip the permission check. i
 * if the role has permission but the permission is not active, skip.
 * if user has permission in the array of required permissions, return true.
 * Important: getUserRolesAndRolePermissions_C is cached and is invalidated upon login.
 */
export const hasPermission = async (
    userId: string,
    requiredPermissions: Set<number>,
): Promise<{
    canAccess: boolean;
    message: string;
}> => {
    try {
        const userRoleAndRolePermissions =
            await getUserRolesAndRolePermissions_C(userId);

        for (const userRole of userRoleAndRolePermissions) {
            if (!userRole.role.isActive) {
                continue;
            }

            for (const rolePermission of userRole.role.rolePermissions) {
                if (requiredPermissions.has(rolePermission.permissionId)) {
                    if (!rolePermission.permission.isActive) {
                        continue;
                    }

                    return {
                        canAccess: true,
                        message: `The user has and uses ${rolePermission.permission.name} permission.`,
                    };
                }
            }
        }
    } catch (error: any) {
        localDebug(error.message, "hasPermission()");
    }

    return {
        canAccess: false,
        message: "The user does not have the required permission.",
    };
};
