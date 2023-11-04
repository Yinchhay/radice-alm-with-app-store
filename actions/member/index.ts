'use server'

import prisma from "@/lib/prisma";
import { Permissions } from "@/types";
import { ResponseMessage } from "@/types/server";
import { currentUserHasPermission } from "@/utils/IAM";

export const projectSetting = async (formData: FormData) => {
    try {
        const { currentUser, hasPermission } = await currentUserHasPermission({
            permissionIdentifiers: [Permissions.EDIT_PROJECT],
        });

        if (!currentUser || !hasPermission) {
            return {
                success: false,
                message: ResponseMessage.FORBIDDEN_NO_PERMISSION
            }
        }

        const name = formData.get('name');
        const description = formData.get('description');
        const year = formData.get('year');
        const project_id = formData.get('project_id') as string;

        if (typeof name !== 'string' || name.length === 0 ||
            typeof description !== 'string' || description.length === 0 ||
            typeof year != 'string' || year.length === 0
        ) {
            return {
                success: false,
                message: ResponseMessage.BAD_REQUEST_BODY,
            }
        }

        const project = await prisma.projects.findFirstOrThrow({
            where: {
                id: project_id,
            },
            include: {
                members: true
            }
        });

        if (currentUser.userId != project.user_id) return {
            success: false,
            message: ResponseMessage.UNAUTHORIZED_ACCESS,
        }

        const updateProject = await prisma.projects.update({
            where: {
                id: project_id
            },
            data: {
                name: name,
                description: description,
                year: year,
            }
        });

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