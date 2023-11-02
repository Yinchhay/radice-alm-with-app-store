import { Permissions, Roles } from "@prisma/client"
import { serverUrlPath } from "."
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

type RolePermission = {
    permissionIdentifiers: number[]
}

type HasPermissionProps = {
    permissionIdentifiers: number[],
    roles: {
        roleIds: string[]
    }
}

export const getRolePermission = async (roleId: string) => {
    const role = await prisma.roles.findFirstOrThrow({
        where: {
            id: roleId
        }
    });

    if (role.is_active) {
        const rolePermission = role.permission as RolePermission;

        if (rolePermission && rolePermission.permissionIdentifiers.length > 0) {
            return rolePermission;
        }
    }

    return null;
}

export const getPermission = async (permissionIdentifier: number) => {
    const permission = await prisma.permissions.findFirstOrThrow({
        where: {
            identifier: permissionIdentifier
        }
    });

    if (permission.is_active) {
        return permission;
    }

    return null;
}

// check if user has permission (only work if role that has permission is active and permission is active)
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
                    if (!permission || !permission.is_active) return false;

                    return true;
                }
            }
        }
    } catch (err) {
        return false;
    }

    return false;
}