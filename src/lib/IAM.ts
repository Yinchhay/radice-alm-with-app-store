import { lucia } from "@/auth/lucia";
import { User } from "lucia";
import { Permissions } from "@/types/IAM";
import { cache } from "react";
import { localDebug } from "./utils";
import { UserType } from "@/types/user";
import { getUserRolesAndRolePermissions_C } from "@/repositories/users";

export const SALT_ROUNDS = 10;

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
        {
            checkAllRequiredPermissions = false,
        }: {
            checkAllRequiredPermissions?: boolean;
        } = {},
    ): Promise<{
        canAccess: boolean;
        message: string;
        userPermissions: Set<Permissions>;
    }> => {
        let userPermissions: Set<Permissions> = new Set();
        let canAccess = false;

        if (requiredPermissions.size === 0) {
            return {
                canAccess: false,
                message:
                    "Required permission is required to check user has permission or not",
                userPermissions,
            };
        }

        try {
            const user = await getUserRolesAndRolePermissions_C(userId);

            if (!user) {
                localDebug("User not found.", "hasPermission()");
                return {
                    canAccess: false,
                    message: "User not found.",
                    userPermissions,
                };
            }

            if (user.type === UserType.SUPER_ADMIN) {
                localDebug(
                    "Access granted because user is superadmin",
                    "hasPermission()",
                );
                return {
                    canAccess: true,
                    message: "Access granted because user is superadmin",
                    userPermissions: allPermissionsToSet(),
                };
            }

            if (!user.hasLinkedGithub) {
                localDebug(
                    "User has not linked Github account, it's mandatory to link a github account to access the system.",
                    "hasPermission()",
                );
                return {
                    canAccess: false,
                    message:
                        "User has not linked Github account, it's mandatory to link a github account to access the system.",
                    userPermissions,
                };
            }

            for (const userRole of user?.userRoles ?? []) {
                if (!userRole.role.isActive) {
                    continue;
                }

                for (const rolePermission of userRole.role.rolePermissions) {
                    if (!rolePermission.permission.isActive) {
                        continue;
                    }

                    if (requiredPermissions.has(rolePermission.permissionId)) {
                        userPermissions.add(rolePermission.permissionId);

                        if (!checkAllRequiredPermissions) {
                            localDebug(
                                `User has ${rolePermission.permission.name} permission.`,
                                "hasPermission()",
                            );
                            return {
                                canAccess: true,
                                message: `The user has and uses ${rolePermission.permission.name} permission.`,
                                userPermissions,
                            };
                        }

                        canAccess = true;
                    }
                }
            }

            if (canAccess) {
                localDebug(
                    "User has the required permission.",
                    "hasPermission()",
                );
                return {
                    canAccess: true,
                    message: "The user has the required permission.",
                    userPermissions,
                };
            }
        } catch (error: any) {
            localDebug(error.message, "hasPermission()");
        }

        localDebug(
            "The user does not have the required permission.",
            "hasPermission()",
        );
        return {
            canAccess: false,
            message: "The user does not have the required permission.",
            userPermissions,
        };
    },
);

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

/**
 * I believe since this is often used for internal users,
 * the data structure for this should be Map so that it will improve performance
 * which is better than using object. And the reason I create the RouteRequiredPermissions
 * here because exporting in page.tsx is not allow in production, and I need route required
 * permissions for e2e test
 * - YatoRizzGod
 */
type RouteKey =
    | "manageAllProjects"
    | "manageApplicationForms"
    | "manageCategories"
    | "managePartners"
    | "manageRoles"
    | "manageUsers"
    | "manageMedia";
export const RouteRequiredPermissions = new Map<RouteKey, Set<Permissions>>([
    ["manageAllProjects", new Set([Permissions.CHANGE_PROJECT_STATUS])],
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
        new Set([Permissions.CREATE_PARTNERS, Permissions.DELETE_PARTNERS]),
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
        new Set([Permissions.CREATE_USERS, Permissions.DELETE_USERS]),
    ],
    [
        "manageMedia",
        new Set([
            Permissions.CREATE_MEDIA,
            Permissions.EDIT_MEDIA,
            Permissions.DELETE_MEDIA,
        ]),
    ],
]);

// If one of the required permissions is met, the user can access the route
export function userCanAccessRoute(
    routeRequiredPermissionKey: RouteKey,
    permissions: Set<Permissions>,
): boolean {
    const requiredPermissions = RouteRequiredPermissions.get(
        routeRequiredPermissionKey,
    );
    if (!requiredPermissions) {
        return false;
    }

    for (const permission of requiredPermissions) {
        if (permissions.has(permission)) {
            return true;
        }
    }

    return false;
}

function allPermissionsToSet(): Set<Permissions> {
    const allPermissions = new Set<Permissions>();
    Object.values(Permissions).forEach((value) => {
        if (typeof value === "number") {
            allPermissions.add(value);
        }
    });

    return allPermissions;
}

export const AllPermissionsInTheSystem = allPermissionsToSet();
