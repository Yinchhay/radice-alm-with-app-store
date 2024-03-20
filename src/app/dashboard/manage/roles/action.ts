"use server";
import { z } from "zod";
import { createRoleFormSchema, deleteRoleFormSchema } from "./page";
import {
    ActionResult,
    formatZodError,
    generateAndFormatZodError,
} from "@/lib/form";
import { createRole, deleteRoleById } from "@/repositories/role";
import { ErrorMessage } from "@/types/error";
import { localDebug } from "@/lib/utils";
import { MysqlErrorCodes } from "@/types/db";
import { revalidateTag } from "next/cache";
import { hasPermission } from "@/lib/IAM";
import { getAuthUser } from "@/auth/lucia";
import { Permissions } from "@/types/IAM";

export async function createRoleAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof createRoleFormSchema>>> {
    try {
        const requiredPermission = new Set([Permissions.CREATE_ROLES]);
        const user = await getAuthUser();
        if (!user) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.UserUnauthenticated,
                ),
            };
        }

        const userPermission = await hasPermission(user.id, requiredPermission);
        if (!userPermission.canAccess) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.NoPermissionToPerformThisAction,
                ),
            };
        }

        const data: z.infer<typeof createRoleFormSchema> = {
            name: formData.get("name") as string,
        };

        const validationResult = createRoleFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        await createRole(data);
        revalidateTag("getRoles_C");

        return {
            errors: null,
        };
    } catch (error: any) {
        localDebug(error.message, "createRoleAction");

        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return {
                errors: generateAndFormatZodError(
                    "name",
                    // remember try to make message clear, in this case only name has unique constraint
                    "Role name already exists",
                ),
            };
        }

        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}

export async function deleteRoleAction(
    prevState: any,
    formData: FormData,
): Promise<ActionResult<z.infer<typeof deleteRoleFormSchema>>> {
    try {
        const requiredPermission = new Set([Permissions.DELETE_ROLES]);
        const user = await getAuthUser();
        if (!user) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.UserUnauthenticated,
                ),
            };
        }

        const userPermission = await hasPermission(user.id, requiredPermission);
        if (!userPermission.canAccess) {
            return {
                errors: generateAndFormatZodError(
                    "unknown",
                    ErrorMessage.NoPermissionToPerformThisAction,
                ),
            };
        }

        const data: z.infer<typeof deleteRoleFormSchema> = {
            roleId: Number(formData.get("roleId")),
        };

        const validationResult = deleteRoleFormSchema.safeParse(data);
        if (!validationResult.success) {
            return {
                errors: formatZodError(validationResult.error),
            };
        }

        await deleteRoleById(data.roleId);
        revalidateTag("getRoles_C");

        return {
            errors: null,
        };
    } catch (error) {
        return {
            errors: generateAndFormatZodError(
                "unknown",
                ErrorMessage.SomethingWentWrong,
            ),
        };
    }
}
