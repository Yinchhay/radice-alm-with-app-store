import { getUserRolesAndRolePermissions_C } from "@/repositories/users";
import { localDebug } from "./utils";
import { Permissions } from "@/types/IAM";
import { cache } from "react";
import { lucia } from "@/auth/lucia";
import { User } from "lucia";
import { projects } from "@/drizzle/schema";

/**
 * This function take a user id and a set of required permissions and return a boolean and a message
 * Brief: get user roles, then get role permissions, then check if the user has the required
 * permission.
 * if the role is not active skip the permission check. i
 * if the role has permission but the permission is not active, skip.
 * if user has permission in the array of required permissions, return true.
 * Important: getUserRolesAndRolePermissions_C is cached and is invalidated upon login.
 */
export const hasPermission = cache(
    async (
        userId: string,
        requiredPermissions: Set<Permissions>,
    ): Promise<{
        canAccess: boolean;
        message: string;
    }> => {
        try {
            if (requiredPermissions.size === 0) {
                return {
                    canAccess: false,
                    message:
                        "Required permission is required to check user has permission or not",
                };
            }

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
    },
);

/**
 * I believe since this is often used for internal users,
 * the data structure for this should be Map so that it will improve performance
 * which is better than using object. And the reason I create the routeRequiredPermissions
 * here because exporting in page.tsx is not allow in production, and I need route required
 * permissions for e2e test
 * - YatoRizzGod
 */
type routeKey =
    | "manageAllProjects"
    | "manageApplicationForms"
    | "manageCategories"
    | "managePartners"
    | "manageRoles"
    | "manageUsers";
export const routeRequiredPermissions = new Map<routeKey, Set<Permissions>>([
    [
        "manageAllProjects",
        new Set([
            Permissions.CHANGE_PROJECT_STATUS,
            Permissions.DELETE_PROJECTS,
        ]),
    ],
    [
        "manageApplicationForms",
        new Set([Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS]),
    ],
    [
        "manageCategories",
        new Set([
            Permissions.CREATE_CATEGORIES,
            Permissions.EDIT_CATEGORIES,
            Permissions.DELETE_CATEGORIES,
        ]),
    ],
    [
        "managePartners",
        new Set([
            Permissions.CREATE_PARTNERS,
            Permissions.EDIT_PARTNERS,
            Permissions.DELETE_PARTNERS,
        ]),
    ],
    [
        "manageRoles",
        new Set([
            Permissions.CREATE_ROLES,
            Permissions.EDIT_ROLES,
            Permissions.DELETE_ROLES,
        ]),
    ],
    [
        "manageUsers",
        new Set([
            Permissions.CREATE_USERS,
            Permissions.EDIT_USERS,
            Permissions.DELETE_USERS,
        ]),
    ],
]);

export const checkBearerAndPermission = async (
    request: Request,
    requiredPermissions: Set<Permissions>,
): Promise<
    | {
          errorNoBearerToken: false;
          errorNoPermission: true;
          user: null;
      }
    | {
          errorNoBearerToken: true;
          errorNoPermission: false;
          user: null;
      }
    | {
          errorNoBearerToken: false;
          errorNoPermission: false;
          user: User;
      }
> => {
    const authorizationHeader = request.headers.get("Authorization");
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
    if (!sessionId) {
        return {
            errorNoBearerToken: true,
            errorNoPermission: false,
            user: null,
        };
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session || !user) {
        return {
            errorNoBearerToken: true,
            errorNoPermission: false,
            user: null,
        };
    }

    // if no required permission passed, skip the permission check
    if (requiredPermissions.size > 0) {
        const userPermission = await hasPermission(
            user.id,
            requiredPermissions,
        );
        if (!userPermission.canAccess) {
            return {
                errorNoBearerToken: false,
                errorNoPermission: true,
                user: null,
            };
        }
    }

    return {
        errorNoBearerToken: false,
        errorNoPermission: false,
        user: user,
    };
};
