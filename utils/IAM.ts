import { Permissions, Roles } from "@prisma/client"
import { serverUrlPath } from "."
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { getPageSession } from "@/auth/lucia"
import { IAuthUser } from "@/types"

type RolePermission = {
    permissionIdentifiers: number[]
}

type HasPermissionProps = {
    permissionIdentifiers: number[],
    roles: {
        roleIds: string[]
    }
}

type CurrentUserHasPermissionProps = {
    permissionIdentifiers: number[],
}

type CurrentUserHasPermissionReturn = {
    currentUser: IAuthUser | null,
    hasPermission: boolean,
}

export const getRolePermission = async (roleId: string) => {
    // const role = await prisma.roles.findFirstOrThrow({
    //     where: {
    //         id: roleId
    //     }
    // });
    const res = await fetch(serverUrlPath(`/api/v1/auth/guest/role/${roleId}`), {
        credentials: 'include',
        headers: { Cookie: cookies().toString() },
    });
    const json = await res.json();
    const role: Roles = json.data.role;

    if (!role) return null;

    if (role.is_active) {
        const rolePermission = role.permission as RolePermission;

        if (!rolePermission) return null;

        if (rolePermission.permissionIdentifiers.length > 0) return rolePermission;
    }

    return null;
}

export const getPermission = async (permissionIdentifier: number) => {
    // const permission = await prisma.permissions.findFirstOrThrow({
    //     where: {
    //         identifier: permissionIdentifier
    //     }
    // });
    const res = await fetch(serverUrlPath(`/api/v1/auth/guest/permission/byIdentifier/${permissionIdentifier}`), {
        credentials: 'include',
        headers: { Cookie: cookies().toString() },
    });
    const json = await res.json();
    const permission: Permissions = json.data.permission;

    if (!permission) return null;

    if (permission.is_active) return permission;

    return null;
}

/**
 *  check if user has permission (only work if role that has permission is active and permission is
 *  active)
 *  this function can check multiple roles and multiple permissions in a role per call
 * */
export const hasPermission = async ({ permissionIdentifiers, roles }: HasPermissionProps): Promise<boolean> => {
    try {
        if (!permissionIdentifiers || permissionIdentifiers.length === 0) return false;
        if (!roles || roles.roleIds.length === 0) return false;

        for (const roleId of roles.roleIds) {
            // get rolePermission, if it's null we don't need to check further
            const rolePermission = await getRolePermission(roleId);

            if (!rolePermission) continue;

            // check multiple permission under a role
            for (const permissionIdentifier of permissionIdentifiers) {
                if (rolePermission.permissionIdentifiers.includes(permissionIdentifier)) {
                    const permission = await getPermission(permissionIdentifier);

                    if (!permission || !permission.is_active) continue;

                    return true;
                }
            }
        }
    } catch (err) {
        return false;
    }

    return false;
}

/**
 * This function will check if current user has permission.
 * It will return object with currentUser and hasPermission.
 */
export const currentUserHasPermission = async ({ permissionIdentifiers }: CurrentUserHasPermissionProps): Promise<CurrentUserHasPermissionReturn> => {
    try {
        const session = await getPageSession();

        if (!session) return {
            currentUser: null,
            hasPermission: false
        }

        return {
            currentUser: session.user,
            hasPermission: await hasPermission({
                permissionIdentifiers,
                roles: session.user.roles
            })
        };

    } catch (err) {
        return {
            currentUser: null,
            hasPermission: false
        }
    }
}