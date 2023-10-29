'use server'
import { getPageSession } from "@/auth/lucia";
import prisma from "@/lib/prisma";
import { Permissions } from "@/types";
import { ResponseMessage } from "@/types/server";
import { hasPermission } from "@/utils/IAM";
import { revalidatePath } from "next/cache";

export const createRole = async (formData: FormData) => {
    try {
        const session = await getPageSession();
        if (!session) {
            return {
                success: false,
                message: ResponseMessage.UNAUTHORIZED
            }
        }

        if (!await hasPermission({
            permissionIdentifiers: [Permissions.MODIFY_ROLE],
            roles: session.user.roles
        })) {
            return {
                success: false,
                message: ResponseMessage.FORBIDDEN_NO_PERMISSION
            }
        }

        const permissions = formData.getAll('permission');
        const name = formData.get('name');
        const description = formData.get('description');

        if (permissions.length === 0 || typeof name !== "string" ||
            typeof description !== "string" || name.length === 0 ||
            description.length === 0
        ) {
            return {
                success: false,
                message: ResponseMessage.BAD_REQUEST_BODY,
            }
        }

        const role = await prisma.roles.create({
            data: {
                name: name,
                description: description,
                permission: {
                    // cast array of string to array of number
                    permissionIdentifiers: permissions.map(i=>Number(i))
                } as any,
            }
        })

        return {
            success: true,
            message: ResponseMessage.SUCCESS
        };

    } catch (err) {
        return {
            success: false,
            message: ResponseMessage.INTERNAL_SERVER_ERROR,
        };
    }
}

export const assignRole = async (formData: FormData) => {
    try {
        const userId = formData.get('userId') as string;
        const roleIds = formData.getAll('roleId') as string[];

        // this will perform a check on the role, if doesn't exist it will throw an error
        // we  check it only to ensure that we assign role that exist
        for (const roleId of roleIds) {
            const roleExist = await prisma.roles.findFirstOrThrow({
                where: {
                    id: roleId
                }
            });
        }

        const userExist = await prisma.users.findFirstOrThrow({
            where: {
                id: userId
            }
        });

        const updateUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                roles: userExist.roles = {
                    roleIds: [...roleIds]
                }
            }
        })

        return {
            success: true,
            message: ResponseMessage.SUCCESS
        };

    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: ResponseMessage.INTERNAL_SERVER_ERROR,
        };
    }
}